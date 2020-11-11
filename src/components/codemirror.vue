<template>
  <div class="in-coder-panel">
    <div class="in-coder-panel2">
    <textarea ref="textarea"></textarea>
  </div>
  </div>
</template>

<script type="text/ecmascript-6">
// 引入全局实例
import _CodeMirror from "codemirror";

// 核心样式
import "codemirror/lib/codemirror.css";
// 引入主题后还需要在 options 中指定主题才会生效
import "codemirror/theme/dracula.css";
import "codemirror/theme/neo.css";
import "codemirror/theme/moxer.css";
import "codemirror/theme/nord.css";
import "codemirror/theme/ayu-dark.css";
import 'codemirror/addon/hint/javascript-hint'
// 需要引入具体的语法高亮库才会有对应的语法高亮效果
// codemirror 官方其实支持通过 /addon/mode/loadmode.js 和 /mode/meta.js 来实现动态加载对应语法高亮库
// 但 vue 貌似没有无法在实例初始化后再动态加载对应 JS ，所以此处才把对应的 JS 提前引入
import "codemirror/mode/javascript/javascript.js";

// 尝试获取全局实例
const CodeMirror = window.CodeMirror || _CodeMirror;
export default {
  name: "Codemirror",
  props: {
    // 外部传入的内容，用于实现双向绑定
    value: String,
    theme: String,
    // 外部传入的语法类型
    language: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      // 内部真实的内容
      code: "",
      // 默认的语法类型
      mode: "javascript",
      // 编辑器实例
      coder: null,
      // 默认配置
      options: {
        // 缩进格式
        tabSize: 2,
        // 主题，对应主题库 JS 需要提前引入
        theme: "",
        matchBrackets : true,
        lineWrapping: true,
        // 显示行号
        lineNumbers: true,
        smartIndent: true, 
        indentWithTabs: true,
        line: true
      },
      // 支持切换的语法高亮类型，对应 JS 已经提前引入
      // 使用的是 MIME-TYPE ，不过作为前缀的 text/ 在后面指定时写死了
      str1: {
        total: 25,
        limit: 10,
        skip: 0,
        links: {
          previous: undefined,
          next: function() {}
        }
      }
    };
  },
  mounted() {
    // 初始化
    this._initialize();
  },
  watch: {
    value (value) {
      this.updateData()
    }
  },
  methods: {
    checkBoolean(a){
         if(a){
              return true;
         }else{
              return false;
         }
         },
    // 初始化
    _initialize() {
      // 初始化编辑器实例，传入需要被实例化的文本域对象和默认配置
      this.options.theme = this.theme
      this.coder = CodeMirror.fromTextArea(this.$refs.textarea, this.options);
      // 编辑器赋值
      this.coder.setValue(this.value || this.code);

      // 支持双向绑定
      this.coder.on("change", coder => {
        this.code = coder.getValue();
        if (this.$emit) {
          this.$emit("input", this.code);
        }
      });

      // 尝试从父容器获取语法类型
      if (this.language) {
        // 获取具体的语法类型对象
        let modeObj = this._getLanguage(this.language);

        // 判断父容器传入的语法是否被支持
        if (modeObj) {
          this.mode = modeObj.label;
        }
      }
    },
    updateData(){
       this.coder.setValue(this.value)
    },
    // 获取当前语法类型
    _getLanguage(language) {
      // 在支持的语法类型列表中寻找传入的语法类型
      return this.modes.find(mode => {
        // 所有的值都忽略大小写，方便比较
        let currentLanguage = language.toLowerCase();
        let currentLabel = mode.label.toLowerCase();
        let currentValue = mode.value.toLowerCase();

        // 由于真实值可能不规范，例如 java 的真实值是 x-java ，所以讲 value 和 label 同时和传入语法进行比较
        return (
          currentLabel === currentLanguage || currentValue === currentLanguage
        );
      });
    },
    getValue(){
        return this.coder.getValue();
    },
    // 更改模式
    changeMode(val) {
      // 修改编辑器的语法配置
      this.coder.setOption("mode", `text/${val}`);

      // 获取修改后的语法
      let label = this._getLanguage(val).label.toLowerCase();

      // 允许父容器通过以下函数监听当前的语法值
      this.$emit("language-change", label);
    }
  }
};
</script>

<style>
/*定义滚动条宽高及背景，宽高分别对应横竖滚动条的尺寸*/
.scrollbar::scrollbar{
    width: 16px;
    height: 16px;
    background-color: #f5f5f5;
}
/*定义滚动条的轨道，内阴影及圆角*/
.scrollbar::scrollbar-track{
    box-shadow: inset 0 0 6px rgba(0,0,0,.3);
    border-radius: 10px;
    background-color: #f5f5f5;
}
/*定义滑块，内阴影及圆角*/
.scrollbar::scrollbar-thumb{
    /*width: 10px;*/
    height: 20px;
    border-radius: 10px;
    box-shadow: inset 0 0 6px rgba(0,0,0,.3);
    background-color: #555;
}
.in-coder-panel {
  margin: 10px;
  flex-grow: 1;
  display: flex;
  position: relative;
}
.in-coder-panel2 {
  flex-grow: 1;
}
.CodeMirror {
  flex-grow: 1;
  z-index: 1;
}
.CodeMirror-code {
  line-height: 19px;
}
.code-mode-select {
  position: absolute;
  z-index: 3;
  right: 10px;
  top: 10px;
  max-width: 130px;
}
</style>
