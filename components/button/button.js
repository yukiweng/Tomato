// components/button/button.js
Component({
  properties:{
    size:{
      type:String,
      value:''
    },
    type:{
      type:String,
      value:''
    }
  },
  methods:{
    buttonEvent(e){
      this.triggerEvent('clickButton',e)
    }
  }
})