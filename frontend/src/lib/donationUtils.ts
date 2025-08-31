import { Donation, DonationsByShortage, DonationStats } from '@/models/Donation'

/**
 * Calculate donation progress for a shortage request
 */
export function calculateDonationProgress(
  totalDonated: number, 
  estimatedFunding: number
): number {
  if (!estimatedFunding || estimatedFunding <= 0) return 0
  const progress = (totalDonated / estimatedFunding) * 100
  return Math.min(progress, 100) // Cap at 100%
}

/**
 * Get completed donations only
 */
export function getCompletedDonations(donations: Donation[]): Donation[] {
  return donations.filter(donation => donation.status === 'completed')
}

/**
 * Calculate total amount from completed donations
 */
export function calculateTotalDonated(donations: Donation[]): number {
  return getCompletedDonations(donations)
    .reduce((total, donation) => total + donation.amount, 0)
}

/**
 * Group donations by shortage ID with progress calculation
 */
export function groupDonationsByShortage(
  donations: Donation[],
  shortagesWithFunding: Array<{ shortage_id: string; estimated_funding?: number }>
): DonationsByShortage[] {
  // Group donations by shortage_id
  const grouped = donations.reduce((acc, donation) => {
    if (!donation.shortage_id) return acc
    
    if (!acc[donation.shortage_id]) {
      acc[donation.shortage_id] = []
    }
    acc[donation.shortage_id].push(donation)
    return acc
  }, {} as Record<string, Donation[]>)
  
  // Convert to array with progress calculation
  return Object.entries(grouped).map(([shortageId, donationList]) => {
    const totalDonated = calculateTotalDonated(donationList)
    const completedCount = getCompletedDonations(donationList).length
    
    // Find estimated funding for this shortage
    const shortageInfo = shortagesWithFunding.find(s => s.shortage_id === shortageId)
    const estimatedFunding = shortageInfo?.estimated_funding
    
    const progressPercentage = estimatedFunding 
      ? calculateDonationProgress(totalDonated, estimatedFunding)
      : undefined
    
    return {
      shortage_id: shortageId,
      total_donated: totalDonated,
      donation_count: completedCount,
      estimated_funding: estimatedFunding,
      progress_percentage: progressPercentage,
      donations: donationList
    }
  })
}

/**
 * Format currency amount for display
 */
export function formatCurrency(amount: number, currency: string = 'LKR'): string {
  return new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

/**
 * Format donation statistics for display
 */
export function formatDonationStats(stats: DonationStats): {
  totalAmount: string;
  completionRate: string;
  averageDonation: string;
} {
  const completionRate = stats.total_donations > 0 
    ? ((stats.completed_count / stats.total_donations) * 100).toFixed(1)
    : '0.0'
  
  const averageDonation = stats.completed_count > 0
    ? stats.total_amount / stats.completed_count
    : 0
  
  return {
    totalAmount: formatCurrency(stats.total_amount),
    completionRate: `${completionRate}%`,
    averageDonation: formatCurrency(averageDonation)
  }
}

/**
 * Get donation status color for UI
 */
export function getDonationStatusColor(status: Donation['status']): string {
  switch (status) {
    case 'completed':
      return 'text-green-600 bg-green-50'
    case 'pending':
      return 'text-yellow-600 bg-yellow-50'
    case 'failed':
      return 'text-red-600 bg-red-50'
    case 'cancelled':
      return 'text-gray-600 bg-gray-50'
    default:
      return 'text-gray-600 bg-gray-50'
  }
}

/**
 * Get progress bar color based on percentage
 */
export function getProgressBarColor(percentage: number): string {
  if (percentage >= 100) return 'bg-green-500'
  if (percentage >= 75) return 'bg-blue-500'
  if (percentage >= 50) return 'bg-yellow-500'
  if (percentage >= 25) return 'bg-orange-500'
  return 'bg-red-500'
}
