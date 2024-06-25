///Loading Skeleton

///Libraries -->
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import Loading from '@/components/loadingCircle/Circle'

/**
 * @title Loading Skeleton Component
 */
export default function LoadingSkeleton() {
    // You can add any UI inside Loading, including a Skeleton.
    return <Loading width='10px' height='10px' />
}