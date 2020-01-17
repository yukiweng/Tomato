const {http}=require('../../utils/http.js')
Page({
  data: {
    tab:'history',
    list:[],
    tomatoes:{},
    todos:{},
    createdTime:'',
    updatedTime:'',
    day:'',
    timer:null
  },

  onShow(){
    this.fetchTomatoes()
    this.fetchTodos()
  },
  changeTab(){
    let tab
    tab=this.data.tab==='history'?'finish':'history'
    this.setData({tab:tab})
  },
  showFinishTime(e){
    let {created,updated,day}=e.currentTarget.dataset
    this.setData({createdTime:created,updatedTime:updated,day:day})
    if(this.data.timer){
      clearTimeout(this.data.timer)
      this.setTime()
    }else{
      this.setTime()
    }    
  },
  setTime(){
    this.data.timer = setTimeout(() => {
      this.setData({ createdTime: '', updatedTime: '' })
    }, 5000)
  },
  fetchTomatoes(){
    http.get('/tomatoes',{ is_group: "yes" }).then((res)=>{
      this.setData({tomatoes:res.response.data.resources})
    })
  },
  fetchTodos(){
    http.get('/todos', { is_group: "yes" }).then((res)=>{
      this.setData({ todos: res.response.data.resources })
    })
  }
})