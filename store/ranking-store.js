import { HYEventStore as cmEventStore } from 'hy-event-store'

import { getRanking } from '../service/api_music'

const rankingStore = new cmEventStore({
  state: {
    hotRanking: {}
  },
  actions: {
    getRankingDataAction(ctx) {
      getRanking(1).then(res => {
        ctx.hotRanking = res.playlist;
      })
    }
  }
});

export {
  rankingStore
}