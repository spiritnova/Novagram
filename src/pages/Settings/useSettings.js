import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useToast } from '../../context/ToastContext'
import { getSettings, updateSettings } from '../../mock/api'

// Reads the signed-in user's saved settings and returns a save function that updates the screen at once
export default function useSettings() {
    const username = sessionStorage.getItem('username')
    const queryClient = useQueryClient()
    const showToast = useToast()
    const key = ['settings', username]

    const query = useQuery({ queryKey: key, queryFn: () => getSettings(username) })

    const mutation = useMutation({
        mutationFn: (patch) => updateSettings(username, patch),
        onMutate: async (patch) => {
            await queryClient.cancelQueries({ queryKey: key })
            const previous = queryClient.getQueryData(key)
            queryClient.setQueryData(key, (data) => data && ({
                ...data,
                ...patch,
                emails: { ...data.emails, ...patch.emails },
            }))
            return { previous }
        },
        onError: (_error, _patch, context) => {
            queryClient.setQueryData(key, context.previous)
            showToast('Could not save that setting.')
        },
        onSettled: () => queryClient.invalidateQueries({ queryKey: key }),
    })

    return { settings: query.data, isPending: query.isPending, isError: query.isError, refetch: query.refetch, save: mutation.mutate }
}
