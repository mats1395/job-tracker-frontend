import { useState, useEffect, useCallback } from "react"
import axios from "axios"

const API = import.meta.env.VITE_API_URL

export function useJobs() {
  const [jobs, setJobs] = useState([])

  // Load jobs from backend on mount
  useEffect(() => {
    axios.get(`${API}/jobs`, { withCredentials: true })
      .then(res => setJobs(res.data))
      .catch(err => console.error("Failed to load jobs:", err))
  }, [])

  const addJob = useCallback(async (job) => {
    try {
      const res = await axios.post(`${API}/jobs`, job, { withCredentials: true })
      setJobs(prev => [...prev, res.data])
      return res.data
    } catch (err) {
      console.error("Failed to add job:", err)
    }
  }, [])

  const updateJob = useCallback(async (id, patch) => {
    try {
      const res = await axios.patch(`${API}/jobs/${id}`, patch, { withCredentials: true })
      setJobs(prev => prev.map(j => (j._id === id ? res.data : j)))
    } catch (err) {
      console.error("Failed to update job:", err)
    }
  }, [])

  const deleteJob = useCallback(async (id) => {
    try {
      await axios.delete(`${API}/jobs/${id}`, { withCredentials: true })
      setJobs(prev => prev.filter(j => j._id !== id))
    } catch (err) {
      console.error("Failed to delete job:", err)
    }
  }, [])

  const moveJob = useCallback(async (id, newStatus) => {
    // Optimistic update — update UI immediately, sync in background
    setJobs(prev => prev.map(j => (j._id === id ? { ...j, status: newStatus } : j)))
    try {
      await axios.patch(`${API}/jobs/${id}`, { status: newStatus }, { withCredentials: true })
    } catch (err) {
      console.error("Failed to move job:", err)
    }
  }, [])

  const counts = {
    total:     jobs.length,
    wishlist:  jobs.filter(j => j.status === "wishlist").length,
    applied:   jobs.filter(j => j.status === "applied").length,
    interview: jobs.filter(j => j.status === "interview").length,
    offer:     jobs.filter(j => j.status === "offer").length,
    rejected:  jobs.filter(j => j.status === "rejected").length,
  }

  return { jobs, counts, addJob, updateJob, deleteJob, moveJob }
}