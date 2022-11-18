import { defineStore } from 'pinia'

export const useRankStore = defineStore('ranks', ()=>{
  
  const ranks = ref({})
  
  function setRanks(rank) {
    ranks.value = rank
  }

  return { ranks, setRanks }
  }
)
