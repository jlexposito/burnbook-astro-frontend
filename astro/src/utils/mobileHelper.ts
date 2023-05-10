export const isMobileDevice = () : boolean => {
    if ( typeof window !== 'undefined') {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test( navigator.userAgent )
    }
    return false
}