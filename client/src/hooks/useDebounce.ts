import {useEffect,useState} from "react"

export function useDebounce<T>(value:T,delay:number){
  const [debounced,setDebounced]=useState(value)

  useEffect(()=>{

    const timer=setInterval(()=>setDebounced(value),delay)

    return ()=>clearTimeout(timer)

  },[value,delay])



  return debounced
}