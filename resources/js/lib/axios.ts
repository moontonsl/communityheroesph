import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from 'axios';

/**
 * Refresh CSRF token from backend.
 * Returns empty string if refresh fails.
 */
async function refreshCsrfToken(): Promise<string> {
    try {
        const response = await fetch('/csrf/refresh', {
            method: 'GET',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': 'application/json',
            },
            credentials: 'include', // Changed from 'same-origin' to 'include' to ensure cookies are sent
            cache: 'no-store',
        });

        if (!response.ok) {
            console.error('Failed to refresh CSRF token. Status:', response.status);
            return '';
        }

        const data = await response.json();
        const token = data?.token || '';

        if (token) {
            let metaTag = document.querySelector('meta[name="csrf-token"]');
            if (!metaTag) {
                metaTag = document.createElement('meta');
                metaTag.setAttribute('name', 'csrf-token');
                document.head.appendChild(metaTag);
            }
            metaTag.setAttribute('content', token);
            console.log('CSRF token refreshed and updated in meta tag');
        }

        return token;
    } catch (error) {
        console.error('Error refreshing CSRF token:', error);
        return '';
    }
}

/**
 * Get CSRF token from meta tag
 * Always gets fresh token to avoid stale token issues
 * Waits for DOM to be ready if needed
 */
function getCsrfToken(): string {
    // Try to get token from meta tag
    let token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    
    // If not found, try waiting a bit (for initial page load)
    if (!token && document.readyState !== 'complete') {
        // Wait for DOM to be fully loaded
        const metaTag = document.querySelector('meta[name="csrf-token"]');
        token = metaTag?.getAttribute('content') || '';
    }
    
    if (!token) {
        console.error('CSRF token not found in meta tag. Make sure the meta tag exists in the HTML head.');
        // Try to get it from cookies as fallback (Laravel stores it in cookies too)
        const cookies = document.cookie.split(';');
        const csrfCookie = cookies.find(cookie => cookie.trim().startsWith('XSRF-TOKEN='));
        if (csrfCookie) {
            token = decodeURIComponent(csrfCookie.split('=')[1]);
            console.log('Using CSRF token from cookie');
        }
    }
    
    return token || '';
}

/**
 * Configured axios instance with automatic CSRF token handling
 * This ensures all requests include the CSRF token automatically
 */
const axiosInstance: AxiosInstance = axios.create({
    withCredentials: true,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
    },
});

// Request interceptor to automatically add CSRF token to all requests
axiosInstance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        // Skip CSRF token for API routes (they're excluded from CSRF protection)
        const isApiRoute = config.url?.startsWith('/api/');
        
        if (!isApiRoute) {
            // Get fresh CSRF token for each request (only for non-API routes)
            let token = getCsrfToken();
            
            // If token is still not found, try one more time after a brief delay
            // This handles cases where the page just loaded and meta tag isn't ready
            if (!token) {
                // Try to refresh the token from the server
                token = await refreshCsrfToken();
            }
            
            // Add CSRF token to headers (Laravel's preferred method)
            if (token) {
                config.headers['X-CSRF-TOKEN'] = token;
                config.headers['X-XSRF-TOKEN'] = token;
            } else {
                console.warn('CSRF token not found. Request may fail. URL:', config.url);
            }
            
            // For FormData requests, also add _token to body if it's FormData
            if (config.data instanceof FormData && token) {
                // Only add if not already present
                if (!config.data.has('_token')) {
                    config.data.append('_token', token);
                }
            }

            // For JSON requests, make sure _token is present as fallback
            const isPlainObject = (value: unknown): value is Record<string, unknown> => {
                return Object.prototype.toString.call(value) === '[object Object]';
            };

            // For JSON requests, make sure _token is present as fallback
            if (token && config.data && !(config.data instanceof FormData) && isPlainObject(config.data)) {
                config.data = {
                    _token: token,
                    ...config.data,
                };
            }
        } else {
            // API routes don't need CSRF tokens
            console.log('Skipping CSRF token for API route:', config.url);
        }
        
        // Debug: Log request details for POST/PUT/PATCH/DELETE
        if (config.method && ['post', 'put', 'patch', 'delete'].includes(config.method.toLowerCase())) {
            // Check if cookies are available
            const cookies = document.cookie;
            const hasSessionCookie = cookies.includes('ch2_session') || cookies.includes('laravel_session');
            const hasXSRFToken = cookies.includes('XSRF-TOKEN');
            
            // Get token for logging (only if not API route)
            const tokenForLog = !isApiRoute ? getCsrfToken() : null;
            
            console.log('Making request:', {
                method: config.method.toUpperCase(),
                url: config.url,
                isApiRoute,
                hasToken: !!tokenForLog,
                tokenPreview: tokenForLog ? `${tokenForLog.substring(0, 10)}...` : 'none',
                hasCredentials: config.withCredentials,
                cookiesAvailable: cookies,
                hasSessionCookie,
                hasXSRFToken,
            });
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle CSRF token mismatch errors
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
        
        // If CSRF token mismatch (419) and we haven't retried yet
        if (error.response?.status === 419 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            // Get fresh token
            let freshToken = getCsrfToken();
            
            if (!freshToken) {
                freshToken = await refreshCsrfToken();
            }
            
            if (freshToken && originalRequest.headers) {
                // Update the token in the original request
                originalRequest.headers['X-CSRF-TOKEN'] = freshToken;
                originalRequest.headers['X-XSRF-TOKEN'] = freshToken;
                
                // If it's FormData, also update _token
                if (originalRequest.data instanceof FormData) {
                    if (originalRequest.data.has('_token')) {
                        originalRequest.data.set('_token', freshToken);
                    } else {
                        originalRequest.data.append('_token', freshToken);
                    }
                } else if (originalRequest.data && typeof originalRequest.data === 'object') {
                    // For JSON requests, update _token in the payload
                    originalRequest.data = {
                        ...originalRequest.data,
                        _token: freshToken,
                    };
                }
                
                // Retry the request with fresh token
                console.log('Retrying request with fresh CSRF token:', freshToken.substring(0, 10) + '...');
                return axiosInstance(originalRequest);
            }
        }
        
        // Log error details for debugging
        if (error.response) {
            console.error('Request failed:', {
                status: error.response.status,
                statusText: error.response.statusText,
                data: error.response.data,
                url: originalRequest?.url
            });
        }
        
        return Promise.reject(error);
    }
);

export default axiosInstance;

