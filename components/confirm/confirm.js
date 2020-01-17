Component({
  properties:{
    visible:{
      type:Boolean,
      value:false
    },
    placeholder:{
      type:String,
      value:''
    },
    updateItem:{
      type:Object,
      value:{}
    }
  },
  data:{
    msg:''
  },
  methods:{
    confirm(){
      let arr = this.properties.updateItem ? [this.data.msg, this.properties.updateItem.id]:[this.data.msg]    
        this.triggerEvent('confirm', arr)
        this.data.msg=''
    },
    cancel(){
      this.triggerEvent('cancel',this.data.msg)
      this.data.msg = ''
    },
    watchValue(e){
      this.setData({msg:e.detail.value})
    }
  }
})