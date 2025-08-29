import { CreateShortageRequest, MedicineShortage } from '@/models/MedicineRequest'

const BASE_URL = '/api'

export interface ApiResponse<T> {
  success: boolean
  message: string
  data?: T
  error?: string
}

/**
 * Create a new medicine shortage
 */
export async function createShortage(
  shortageData: CreateShortageRequest
): Promise<ApiResponse<{ id: string; hospitalId: string }>> {
  try {
    const response = await fetch(`${BASE_URL}/shortages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(shortageData),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('❌ Create shortage error:', error)
    throw error
  }
}

/**
 * Get all shortages for a specific hospital
 */
export async function getShortagesByHospital(
  hospitalId: string
): Promise<ApiResponse<MedicineShortage[]>> {
  try {
    const response = await fetch(`${BASE_URL}/shortages/${hospitalId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('❌ Get shortages error:', error)
    throw error
  }
}

/**
 * Cancel/delete a shortage
 */
export async function cancelShortage(
  hospitalId: string,
  shortageId: string
): Promise<ApiResponse<void>> {
  try {
    const response = await fetch(`${BASE_URL}/shortages/${hospitalId}/${shortageId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('❌ Cancel shortage error:', error)
    throw error
  }
}
