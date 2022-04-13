import { useContext } from '@nuxtjs/composition-api'

export default function useGetTaxProfiles() {
  const { $api } = useContext()
  const getTaxProfiles = async (params = {}) => {
    return await $api.job.getTaxProfiles(params)
  }

  return {
    getTaxProfiles
  }
}
