<?php

namespace App\Http\Controllers;

use App\Models\BarangaySubmission;
use App\Models\Event;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomepageController extends Controller
{
    public function index()
    {
        // Get comprehensive statistics
        $stats = $this->getAnalyticalStatistics();
        
        return Inertia::render('homepage', [
            'stats' => $stats
        ]);
    }

    private function getAnalyticalStatistics()
    {
        // Barangay Submission Statistics
        $submissionStats = [
            'total' => BarangaySubmission::count(),
            'pending' => BarangaySubmission::pending()->count(),
            'approved' => BarangaySubmission::approved()->count(),
            'rejected' => BarangaySubmission::rejected()->count(),
            'under_review' => BarangaySubmission::underReview()->count(),
            'this_month' => BarangaySubmission::whereMonth('created_at', now()->month)->count(),
            'this_week' => BarangaySubmission::whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()])->count(),
            'last_month' => BarangaySubmission::whereMonth('created_at', now()->subMonth()->month)->count(),
        ];

        // Tier Distribution
        $tierStats = [
            'bronze' => BarangaySubmission::bronze()->count(),
            'silver' => BarangaySubmission::silver()->count(),
            'gold' => BarangaySubmission::gold()->count(),
            'platinum' => BarangaySubmission::platinum()->count(),
        ];

        // Event Statistics
        $eventStats = [
            'total' => Event::count(),
            'pending' => Event::pending()->count(),
            'approved' => Event::approved()->count(),
            'rejected' => Event::rejected()->count(),
            'completed' => Event::completed()->count(),
            'cancelled' => Event::cancelled()->count(),
            'successful' => Event::successful()->count(),
            'this_month' => Event::whereMonth('created_at', now()->month)->count(),
            'this_week' => Event::whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()])->count(),
            'last_month' => Event::whereMonth('created_at', now()->subMonth()->month)->count(),
        ];

        // User Statistics
        $userStats = [
            'total' => User::count(),
            'active' => User::active()->count(),
            'community_admins' => User::byRole('community-admin')->count(),
            'regular_users' => User::byRole('regular-user')->count(),
            'super_admins' => User::byRole('super-admin')->count(),
            'this_month' => User::whereMonth('created_at', now()->month)->count(),
            'this_week' => User::whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()])->count(),
        ];

        // Regional Distribution
        $regionalStats = BarangaySubmission::with('region')
            ->selectRaw('region_name, COUNT(*) as count')
            ->groupBy('region_name')
            ->orderBy('count', 'desc')
            ->limit(10)
            ->get();

        // Monthly Trends (last 6 months)
        $monthlyTrends = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = now()->subMonths($i);
            $monthlyTrends[] = [
                'month' => $month->format('M Y'),
                'submissions' => BarangaySubmission::whereMonth('created_at', $month->month)
                    ->whereYear('created_at', $month->year)
                    ->count(),
                'events' => Event::whereMonth('created_at', $month->month)
                    ->whereYear('created_at', $month->year)
                    ->count(),
                'users' => User::whereMonth('created_at', $month->month)
                    ->whereYear('created_at', $month->year)
                    ->count(),
            ];
        }

        // Recent Activity
        $recentActivity = [
            'recent_submissions' => BarangaySubmission::with(['region', 'province', 'municipality', 'barangay'])
                ->orderBy('created_at', 'desc')
                ->limit(5)
                ->get(),
            'recent_events' => Event::with(['barangaySubmission.region', 'barangaySubmission.province', 'barangaySubmission.municipality', 'barangaySubmission.barangay', 'appliedBy'])
                ->orderBy('created_at', 'desc')
                ->limit(5)
                ->get(),
        ];

        // Calculate growth rates
        $submissionGrowthRate = $this->calculateGrowthRate($submissionStats['this_month'], $submissionStats['last_month']);
        $eventGrowthRate = $this->calculateGrowthRate($eventStats['this_month'], $eventStats['last_month']);
        $userGrowthRate = $this->calculateGrowthRate($userStats['this_month'], User::whereMonth('created_at', now()->subMonth()->month)->count());

        return [
            'submissions' => $submissionStats,
            'tiers' => $tierStats,
            'events' => $eventStats,
            'users' => $userStats,
            'regional_distribution' => $regionalStats,
            'monthly_trends' => $monthlyTrends,
            'recent_activity' => $recentActivity,
            'growth_rates' => [
                'submissions' => $submissionGrowthRate,
                'events' => $eventGrowthRate,
                'users' => $userGrowthRate,
            ],
            'summary' => [
                'total_barangays' => $submissionStats['approved'],
                'total_events' => $eventStats['total'],
                'total_participants' => Event::sum('expected_participants'),
                'success_rate' => $eventStats['total'] > 0 ? round(($eventStats['successful'] / $eventStats['total']) * 100, 1) : 0,
            ]
        ];
    }

    private function calculateGrowthRate($current, $previous)
    {
        if ($previous == 0) {
            return $current > 0 ? 100 : 0;
        }
        
        return round((($current - $previous) / $previous) * 100, 1);
    }
}
