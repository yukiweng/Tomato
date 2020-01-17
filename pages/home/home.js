const {http}=require('../../utils/http.js')

Page({
  data: {
    visible:false,
    list:[],
    updateItem:{},
    animationData:{}
  },
  onShow(){
    this.getTodo()
  },
  createTask(){
    this.data.updateItem && this.setData({ updateItem: {} })
    this.openConfirm()
  },
  confirm(e){
    let content =e.detail[0]
    let id=e.detail[1]
    if(content&&!id){
      this.createTodo(content)     
      this.closeConfirm()    
    }else if(content&&id){
      this.updateTodo(id,content)
      this.closeConfirm()
    }    
  },
  cancel(){
    this.closeConfirm()
  },
  finished(e){
    let id=e.currentTarget.dataset.id
    this.deleteTodo(id)
  },
  openConfirm(){
    this.setData({ visible: true })
  },
  closeConfirm(){
    this.setData({ visible: false })
  },
  changeText(e){ 
    let item=e.currentTarget.dataset.item
    this.setData({ updateItem: item})
    this.openConfirm()
  },
  getTodo(){
    http.get('/todos?completed=false').then((res) => {
      this.setData({ list: res.response.data.resources })
    })
  },
  createTodo(content){
    http.post('/todos', { description: content }).then((res) => {
      let todo = res.response.data.resource
      this.data.list.push(todo)    
      this.setData({ list: this.data.list})      
    }) 
  },
  updateTodo(id,content){
    http.put(`/todos/${id}`, { description: content }).then((res) => {
      this.data.list.forEach((item) => {
        if (item.id === id) {
          item.description = content
          this.setData({ list: this.data.list })
        }
      })
    })
  },
  deleteTodo(id){
    http.put(`/todos/${id}`, { completed: true }).then((res) => {
      this.data.list.forEach((item)=>{
        if(item.id===id){
          item.completed=true
          this.setData({ list: this.data.list })
        }
      })
    })
  }
})