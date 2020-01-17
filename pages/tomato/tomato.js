const {http}=require('../../utils/http.js')
Page({
  data: {
    tomoto:{},
    onShowTime:'', 
    defaultSecond:1500,
    copySecond:1500,
    time:'',
    timer:null,
    timerStatus:'stop',
    abandonVisible:false,
    finishVisible:false
  },
  onShow(){
    this.markTime()
    this.changeTime()
    this.data.timerStatus==='stop'&&this.startTimer()
    this.createTomato()
  },
  markTime(){
    let gapTime
    let nowTime = Date.now() / 1000
    let {onShowTime,timerStatus,defaultSecond,copySecond}=this.data
    if (onShowTime && timerStatus==='stop') {
      gapTime = nowTime - onShowTime
      copySecond = copySecond - gapTime >= 1 ? copySecond - gapTime:0
      this.setData({ defaultSecond: copySecond,copySecond:copySecond, onShowTime: nowTime })     
    } else {
      this.setData({  onShowTime: nowTime })
    }
  },
  changeTime(){
    let min = Math.floor(this.data.defaultSecond/60)
    let sec = Math.floor(this.data.defaultSecond%60)
    if((sec+'').length===1){
      sec='0'+sec
    }
    if((min+'').length===1){
      min='0'+min
    }
    this.setData({ time: `${min}:${sec}`})
  },
  startTimer(){
    if (this.data.defaultSecond > 0){
      this.setData({ timerStatus: 'stop' })
      this.data.timer = setInterval(() => {
        if (this.data.defaultSecond >=1) {
          this.data.defaultSecond -= 1
          this.changeTime()
        }
        else {
          this.stopTimer()
          wx.vibrateLong({
            complete:()=>{
              wx.vibrateLong({
                complete:()=>{
                  wx.vibrateLong({
                    complete:()=>{
                      this.setData({ timerStatus: 'startAgain', finishVisible: true })
                    }
                  })
                }
              })        
            }
          })
        }
      }, 1000)  
    } 
  },
  stopTimer(){
    this.setData({ timerStatus: 'continue' })
    clearInterval(this.data.timer)
  },
  startAgain(){
    this.markTime()
    this.setData({defaultSecond:1500})
    this.changeTime()
    this.startTimer()
    this.createTomato()
  },
  abandon(){
    this.openConfirm('abandonVisible')
    this.stopTimer()
  },
  abandonConfirm(e){ 
    this.setData({ 
      abandonVisible: false,
      defaultSecond: 1500, 
      time: '25:00', 
      timerStatus:'startAgain'})
    let content = e.detail[0]
    let id=this.data.tomato.id
    this.updateTomato(id,content,true)
  },
  abandonCancel(e){
    this.closeConfirm('abandonVisible')
    this.startTimer()
  },
  finishConfirm(e){
    this.closeConfirm('finishVisible')
    let content = e.detail[0]
    let id = this.data.tomato.id
    this.updateTomato(id,content,false)
    this.setData({tomato:{}})
  },
  finishCancel(){
    this.closeConfirm('finishVisible')
    this.setData({ tomato: {} })
  },
  openConfirm(type){
    let obj = type === 'finishVisible' ? { finishVisible: true } : { abandonVisible:true}
    this.setData(obj)
  },
  closeConfirm(type){
    let obj = type === 'finishVisible' ? { finishVisible: false } : { abandonVisible: false }
    this.setData(obj)
  },
  createTomato() {
    http.post('/tomatoes').then((res) => {
      this.setData({ tomato: res.response.data.resource })
    })
  },
  updateTomato(id, content, isAborted) {
    http.put(`/tomatoes/${id}`, { description: content, aborted: isAborted })
  },
  onHide(){
    clearInterval(this.data.timer)
  },
  onUnload: function () {    
    clearInterval(this.data.timer)
    if (this.data.tomato) {
      this.updateTomato(this.data.tomato.id, '退出放弃', true)
    } 
  }
})