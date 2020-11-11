<template>
  <div>
    <!-- <json-viewer :value="str1" :expand-depth="5" copyable boxed sort></json-viewer> -->
    <!-- <codermirror></codermirror> -->
    <div class="flex">
    <codermirror class="flexItem" ref="codermirror" :value="jsonValue" theme="dracula"></codermirror>
    <codermirror class="flexItem" ref="code" :value="code" theme="ayu-dark" ></codermirror>
    <codermirror class="flexItem" ref="zhlang" :value="zhlang" theme="dracula"></codermirror>
    </div>
    <div class="flex">
    <codermirror class="flexItem" ref="enlang" :value="enlang" theme="ayu-dark"></codermirror>
    <codermirror class="flexItem" ref="getValue" :value="getValue" theme="dracula"></codermirror>
    <codermirror class="flexItem" ref="setValue" :value="setValue" theme="ayu-dark"></codermirror>
    </div>
    <button class="getCode" @click="click">生成代码</button>
    <!-- <div class="lanren">
      <div class="full-length">
        <div class="container">
          <h2>
            <span @click="click">代码</span>
          </h2>
          <ul>
            <li>
              <div class="port-5 effect-1">
                <div class="image-box">
                  <div class="img"></div>
                </div>
                <div class="text-desc">
                  <codermirror ref="codermirror" :value="jsonValue" theme="dracula"></codermirror>
                </div>
              </div>
            </li>
            <li>
              <div class="port-5 effect-1">
                <div class="image-box">
                  <div class="img"></div>
                </div>
                <div class="text-desc">
                  <codermirror ref="code" :value="show.code" theme="ayu-dark" ></codermirror>
                </div>
              </div>
            </li>
            <li>
              <div class="port-5 effect-1">
                <div class="image-box">
                  <div class="img"></div>
                </div>
                <div class="text-desc">
                  <codermirror ref="zhlang" :value="show.zhlang" theme="dracula"></codermirror>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>-->
  </div>
</template>

<script>
import codermirror from "./codemirror";
import { WSC, MD5 ,formatJson} from "../assets/baseTool.js";
export default {
  name: "HelloWorld",
  props: {
    msg: String
  },
  data() {
    return {
      wsc: new WSC(),
      jsonValue: `{
                info: {
                    fatherName: 'log',
                    name: 'alarm',
                    Features: 'upload',
                    lang: 'lang_secret',
                    labelWidth: 120,
                    width: 320
                },
                template: [
                { type: 'combox', lang: '应用' },
                // { type: 'combox', lang: '地址编码' },
                // { type: 'combox', lang: '单位名称' },
                // { type: 'textarea', lang: '部门名称' },
                // { type: 'wsSwitch', lang: '负责人' },
                // { type: 'combox', lang: '网卡名' },
                // { type: 'textarea', lang: 'MAC地址' },
                // { type: 'textfield', lang: '描述' },
                // { type: 'combox', lang: 'IP地址' },
                // { type: 'combox', lang: '操作系统' },
                // { type: 'textarea', lang: '主板信息' },
                // { type: 'wsSwitch', lang: '硬盘序列号' },
                // { type: 'combox', lang: '三合一版本号' },
                // { type: 'textarea', lang: '涉密级别' },
                // { type: 'textfield', lang: '厂商编码' },
                // { type: 'combox', lang: '唯一性标识' }
                ]
            }`,
    code:'',
    zhlang:'',
    enlang:'',
    getValue:'',
    setValue:'',
      str1: {
        total: 25,
        limit: 10,
        skip: 0,
        links: {
          previous: undefined,
          next: function() {}
        }
      },
      ops: {
        vuescroll: {},
        scrollPanel: {},
        rail: {
          keepShow: true
        },
        bar: {
          hoverStyle: true,
          onlyShowBarOnScroll: false, //是否只有滚动的时候才显示滚动条
          background: "#F5F5F5",//滚动条颜色
          opacity: 0.5,//滚动条透明度
          "overflow-x": "hidden"
        }
      },
      trans_result: {
        appid: "20200422000426308", //百度翻译开放平台的个人AppId
        salt: new Date().getTime(), //随机数
        q: "第一个\\第二个\\第3个\\第4个", //请求翻译文本
        from: "zh", //源语言
        to: "en", //目标语言
        sign: "", //签名
        userkey: "afCrGHos7L81YQFPaDo6", //百度翻译开放平台的个人密匙
        fyjg: "" //翻译结果}
      }
    };
  },
  // mounted: {
  //   // console.log(this.wsc)
  // },
  methods: {
    click() {
      this.wsc.clearData();
      try {
        this.wsc.data = eval("(" + this.$refs.codermirror.getValue() + ")");
      } catch (error) {
        console.log(error)
        return;
      }
      this.jsonValue = formatJson(this.wsc.data)
      this.wsc.data.template = this.wsc.getIndex(this.wsc.data.template);
      this.trans_result.q = this.wsc.enArr.reduce((sum, item) => {
                return sum = sum + '\\' + item
            });
      this.fanyi();
    },
    fanyi() {
      /* md5加密，生成签名 */
      this.sign = MD5(
        this.trans_result.appid +
          this.trans_result.q +
          this.trans_result.salt +
          this.trans_result.userkey
      );
      /* 对待翻译字符做url编码 */
      /* 请求翻译 */
      this.axios
        .get(
          "/api/" +
            "?q=" +
            this.trans_result.q +
            "&from=" +
            this.trans_result.from +
            "&to=" +
            this.trans_result.to +
            "&appid=" +
            this.trans_result.appid +
            "&salt=" +
            this.trans_result.salt +
            "&sign=" +
            this.sign
        )
        /* 得到返回数据 */
        .then(res => {
          // this.fyjg = res.data.trans_result[0].dst; //得到翻译结果
          if(res.data && res.data.trans_result) {
          this.wsc.enArr = res.data.trans_result[0].dst.split("\/")
          var tpl = this.wsc.seten(this.wsc.data.template);
        this.code = JSON.stringify(this.wsc.dealData(tpl, this.wsc.data.info, false))
          .replace(/,/g, ",\n")
          .replace(/{/g, "{\n")
          .replace(/}/g, "\n}")
          .replace(
            /"lang_util.common_combox_emptyText"/g,
            "lang_util.common_combox_emptyText"
          )
          .replace(/"fieldLabel":"/g, '"fieldLabel":')
          .replace(/",\n"labelWidth"/g, ',\n"labelWidth"')
          .replace(/"@|@"/g, "")
          .replace(/\\n/g, "")
          .replace(/&&/g, '"],["')
          .replace(/&/g, '","')
          .replace(/item,\n/g, 'item,')
          this.zhlang = this.wsc.langArr.join(";\n") + ";"
          this.enlang = this.wsc.langArrEn.join(";\n") + ";"
          this.getValue = this.wsc.getArr.join(";\n") + ";"
          this.setValue = this.wsc.setArr.join(";\n") + ";"
          // this.show = Object.assign({},this.show)
          // this.$refs.code.updateData()
          // this.$refs.zhlang.updateData()
          // this.$refs.enlang.updateData()
          // this.$refs.getValue.updateData()
          // this.$refs.setValue.updateData()
          
      // console.log(this.wsc.langArr.join(";\n") + ";");
      // console.log(this.wsc.langArrEn.join(";\n") + ";");
      // console.log(this.wsc.getArr.join(";\n") + ";");
      // console.log(this.wsc.setArr.join(";\n") + ";");
          /* 把翻译结果分割成数组 */
          // var yiwenArr = new Array();
          // yiwenArr = this.fyjg.split("@");
          } else {
            alert(res.data.error_msg)
          }
        });
    }
  },
  components: {
    codermirror: codermirror
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
html,
body {
  border: 0;
  margin: 0;
  padding: 0;
}
body {
  font: 14px "Lato", Arial, sans-serif;
  min-width: 100%;
  min-height: 100%;
  color: #666;
  background: #aa4b6b; /* fallback for old browsers */
  background: -webkit-linear-gradient(
    to left,
    #3b8d99,
    #6b6b83,
    #aa4b6b
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to left,
    #3b8d99,
    #6b6b83,
    #aa4b6b
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  overflow-x: hidden;
}
.getCode {
  width: 10vh;
  height: 10vh;
  margin: 6% 0 0 47%;
  font-size: 18px;
  font-weight: 700;
  color: rgb(212, 129, 150);
  border: none;
  border-radius: 50%;
  background-color: aqua;
}
/* .container{margin: 0 auto; max-width: 1060px;} */
.container {
  margin: 0 0 0 0;
  max-width: 2000px;
}
h2 {
  color: #fff;
  float: left;
  width: 100%;
  font-size: 24px;
  font-weight: 400;
  text-align: center;
  padding: 50px 0 40px;
  position: relative;
  z-index: 50;
}
h2 span {
  position: relative;
  padding-bottom: 10px;
}
h2 span:after {
  content: "";
  width: 50%;
  height: 3px;
  background-color: #fff;
  position: absolute;
  left: 25%;
  bottom: 0;
}
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
img {
  max-width: 100%;
  vertical-align: middle;
}
.full-length {
  width: 100%;
  float: left;
  padding-bottom: 80px;
}
ul {
  margin: 0 -1.5%;
}
li {
  width: 100%;
  margin-left: 200px;
  list-style: none;
}

.img {
  background: url("../assets/img-1.jpg") repeat;
  max-width: 100%;
  height: 400px;
  vertical-align: middle;
  transition: 0.7s;
}
h3 {
  font-size: 20px;
  margin: 5px 0 10px;
}
p {
  font-weight: 300;
  line-height: 20px;
  font-size: 14px;
  margin-bottom: 15px;
}
.btn {
  display: inline-block;
  padding: 5px 10px;
  font-size: 14px;
  color: #fff;
  border: 2px solid #4d92d9;
  background-color: #4d92d9;
  text-decoration: none;
  transition: 0.4s;
}
.btn:hover {
  background-color: transparent;
  color: #4d92d9;
  transition: 0.4s;
}
.text-desc {
  position: absolute;
  left: 0;
  top: 0;
  background: #aa4b6b; /* fallback for old browsers */
  background: -webkit-linear-gradient(
    to top,
    #3b8d99,
    #6b6b83,
    #aa4b6b
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to top,
    #3b8d99,
    #9f9fc7,
    #aa4b6b
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  height: 100%;
  opacity: 0;
  width: 100%;
  padding: 20px;
}

/* effect-5 css */
.port-5 {
  float: left;
  width: 100%;
  position: relative;
  overflow: hidden;
  text-align: left;
  overflow: visible;
}

.port-5.effect-1 {
  z-index: 9;
}
.port-5.effect-1 img {
  transition: 0.7s;
}
.port-5.effect-1:hover .img {
  transform: scaleX(0.17) scaleY(0.7) translateX(-290%) translateY(-60%);
  position: relative;
  z-index: 9;
  border: 6px solid rgba(255, 255, 255, 0.9);
}
.port-5.effect-1 .text-desc {
  transform: translateX(100%);
  opacity: 0;
  padding: 40px 390px 90px 290px;
  transition: 0.5s;
}
.port-5.effect-1:hover .text-desc {
  transform: translateX(0px);
  opacity: 1;
}

.port-5.effect-2 {
  z-index: 10;
}
.port-5.effect-2 img {
  transition: 0.5s;
  transform: none;
}
.port-5.effect-2:hover img {
  transform: scale(0.5) translateY(100%);
  position: relative;
  z-index: 9;
  border: 6px solid rgba(255, 255, 255, 0.9);
}
.port-5.effect-2 .text-desc {
  transform: translateY(-100%);
  opacity: 0;
  padding: 20px;
  transition: 0.5s;
}
.port-5.effect-2:hover .text-desc {
  transform: translateY(0px);
  opacity: 1;
}

.port-5.effect-3 img {
  transition: 0.5s;
}
.port-5.effect-3:hover img {
  transform: scale(0.5) translateX(100%);
  position: relative;
  z-index: 9;
  border: 6px solid rgba(255, 255, 255, 0.9);
}
.port-5.effect-3 .text-desc {
  transform: translateX(-100%);
  opacity: 0;
  padding: 40px 90px 20px 20px;
  transition: 0.5s;
}
.port-5.effect-3:hover .text-desc {
  transform: translateX(0px);
  opacity: 1;
}
/* effect-5 css end */
@media only screen and (max-width: 360px) {
  ul {
    width: 300px;
  }
  .port-1 .text-desc,
  .port-1.effect-3:hover .text-desc,
  .port-3.effect-1 .text-desc,
  .port-3.effect-3 .text-desc,
  .port-4.effect-1 .text-desc,
  .port-4.effect-2 .text-desc,
  .port-4.effect-3 .text-desc,
  .port-8 .text-desc {
    padding: 20px;
  }
  .text-desc {
    padding: 7px;
  }
  .port-5.effect-1 .text-desc {
    padding: 13px 20px 20px 90px;
  }
  .port-5.effect-2 .text-desc {
    padding: 10px;
  }
  .port-5.effect-3 .text-desc {
    padding: 16px 90px 20px 20px;
  }
  .port-6.effect-1 .text-desc .btn,
  .port-6.effect-2 .text-desc .btn,
  .port-6.effect-3 .text-desc .btn,
  .port-7.effect-1 .text-desc .btn,
  .port-7.effect-2 .text-desc .btn,
  .port-7.effect-3 .text-desc .btn,
  .port-8.effect-3 .text-desc .btn {
    display: none;
  }
  .port-6.effect-2 .text-desc {
    padding: 20px 120px 20px 20px;
  }
  .port-6.effect-3 .text-desc {
    padding: 75px 20px 10px;
  }
  .port-7.effect-1 .text-desc {
    padding: 12px 10px;
  }
  .port-8.effect-3 .text-desc {
    padding: 28px 70px 20px;
  }
}
@media only screen and (max-width: 1090px) {
  ul {
    width: 340px;
    margin: 0 auto;
  }
  li {
    width: 100%;
    margin: 20px 0;
  }
  .port-5.effect-1 {
    z-index: 19;
  }
}
.flex{
  width:100%;
  height:100%;
  border:1px solid black;
  display:flex;
}
.flexItem{
  flex: 1;
}
</style>
