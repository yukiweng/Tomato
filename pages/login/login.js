const {http}=require('../../utils/http.js')
const { app_id, app_secret } = getApp().globalData

Page({
  data:{
    code:''
  },
  onShow(){
    let _this=this
    wx.login({
      success(res){
        _this.data.code=res.code      
      }
    })
  },
  login(e){  
    let { iv, encryptedData: encrypted_data } = e.detail 
    this.wxLogin(iv,encrypted_data)
  },
  wxLogin(iv,encrypted_data){
    let _this=this
    wx.checkSession({
      success(){
        _this.getUserData(_this.data.code, iv, encrypted_data)
      },
      fail(){
        wx.login({
          success: (res) => {
            if (res.code) {
              let code=res.code
              wx.getUserInfo({
                withCredentials: true,
                success: function (res) {
                  let { iv, encryptedData: encrypted_data } = res
                  _this.getUserData(code, iv, encrypted_data)
                }
              })         
            } else {
              wx.showToast({
                title: '请刷新重试',
                duration: 2000,
                mask: true             
              })           
            }
          }
        })
      }
    })    
  },
  getUserData(code,iv,encrypted_data){
    http.post('/sign_in/mini_program_user', {
      code,
      iv,
      encrypted_data,
      app_id,
      app_secret
    }).then((res) => {
      this.saveUserData(res.response)
      wx.reLaunch({
        url: '/pages/home/home',
      })
    })
  },
  saveUserData(response){
    wx.setStorageSync('me', response.data.resource)
    wx.setStorageSync('X-token', response.header["X-token"])
  }
})