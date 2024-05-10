import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import  { useState } from 'react'
import { FaClock } from 'react-icons/fa'
import { FaFilter, FaLocationDot } from 'react-icons/fa6'
import { getActivities, getActivities2 } from '../../../app/api/api'
import { Link } from 'react-router-dom'
import { useStore } from '../../../app/store/store'
import { Activity } from '../../../app/models/activity'
import { format } from 'date-fns'
import Calendar from 'react-calendar'
import InfiniteScroll from 'react-infinite-scroller';

export default  function ActivityDashboard() {
  const [params, setParams] = useState("")
  const [startDate, setStartDate] = useState(new Date().toISOString())
  const[pageNumber, setPageNumber] = useState(1)
  const{activityStore} = useStore()
  const {data,isLoading, isError, error, isSuccess,} = useQuery({
    queryKey:["getActivities",params, startDate, pageNumber],
    queryFn : () => getActivities(params, startDate, pageNumber),

  })
  if (isLoading) {
    return <h1>Loading...</h1>
  }

  if (isSuccess) {
      activityStore.saveActivities(data)
      console.log(data);
      
  }

  if (isError) {
    console.log(error);
  }

// const infiniet = useInfiniteQuery({
//   queryKey:["uer"],
//   initialPageParam:0,
//   getNextPageParam:(lastPage, all,param) => {
//     if (lastPage.hasNextPage) {
//       return pageNumber
//     }
//     return 1
//   },
//   queryFn:() => getActivities2({pageNumber})
// })


  const handleGetNext = () => {
    activityStore.nextPagination()
    setPageNumber(pageNumber+1)
    
  }

  return (
    <div className="container px-10 py-20">
      <div className="grid gap-4 grid-cols-5">   
        <div className="activities flex-col col-span-3">
      <InfiniteScroll  hasMore={activityStore.hasNextPage} pageStart={4} initialLoad={false} loadMore={handleGetNext} >
          {activityStore.groupedActivities.map(([group, activities]) => (
            <>
              <p className='text-blue-500 font-semibold mb-2'>{group}</p>
              {activities.map((activity: Activity) => (
                <div className="bg-white mb-5 w-[75%] ml-20 rounded">
                  <div className="border-b-2 flex p-4">
                    <img src="/assets/user.png" className="w-20 rounded-full" />
                    <section className="ml-10">
                      <p className="text-xl font-semibold">{activity.title}</p>
                      <p className="text-sm">
                        Hosted By <Link to={`/profile/${activity.hostUsername}`} className='hover:text-blue-500'>{activity.hostUsername}</Link>{" "}
                      </p>
                    </section>
                  </div>
                  <div className="p-4 border-b-2">
                    <div>
                      <FaClock className="inline text-blue-600" />{" "}
                      {format(activity.date!, "dd MMM yyyy h:mm aa")},{" "}
                      <FaLocationDot className="inline text-blue-600" />{" "}
                      {activity.city} {activity.venue}
                    </div>
                  </div>
                  <div className="flex p-2 justify">
                    {activity.attendees.map((d: any) => (
                      <div className="image p-2">
                        <Link to={`/profile/${d.username}`}>
                          <img
                            src={d.image || "/assets/user.png"}
                            className="w-10 rounded-full hover:ring-1 hover:ring-blue-500 active:ring-2"
                          />
                        </Link>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between p-4 border-t-2">
                    <p>{activity.description}</p>
                    <Link
                      to={`/activities/${activity.id}`}
                      className="bg-blue-500 py-2 px-3 text-sm text-white rounded-lg hover:outline hover:outline-blue-300 active:outline-blue-200"
                    >
                      View
                    </Link>
                  </div>
                </div>
              ))}
            </>
          ))}
          
        </InfiniteScroll>     
        </div>
        <div className="filter col-span-2">
          <div className='w-80 bg-white mt-8 mb-5 rounded'>
            <div className='text-blue-500 font-semibold p-3 border-b-2 flex items-center'><FaFilter/><p> Filter</p></div>
            <ul>
              <li className='p-2 border-b-2 hover:bg-blue-500 hover:text-white active:bg-blue-400' onClick={() => setParams("all")}>All Activities</li>
              <li className='p-2 border-b-2 hover:bg-blue-500 hover:text-white active:bg-blue-400' onClick={() => setParams("going")}>I'm Going</li>
              <li className='p-2 border-b-2 hover:bg-blue-500 hover:text-white active:bg-blue-400' onClick={() => setParams("hosting")}>I'm Hosting</li>
            </ul>
          </div>
        <Calendar value={new Date().toISOString()} className="rounded" onChange={e => {setStartDate((e as Date).toISOString())}}/>
        </div>
      </div>
    </div>
  );
}
