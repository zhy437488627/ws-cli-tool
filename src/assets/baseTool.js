class WSC {
  constructor(o) {
    this.fieldLabel = o || ''
    this.lang = o || ''
    this.langArr = o || []
    this.langArrEn = o || []
    this.setArr = o || []
    this.data = o || {}
    this.indexNum = 0
    this.enArr = []
  }
  clearData(){
    this.fieldLabel = ''
    this.lang = ''
    this.langArr = []
    this.langArrEn =  []
    this.setArr =  []
    this.getArr = []
    this.data =  {}
    this.indexNum = 0
    this.enArr = []
  }
  //数据处理
  dealData(data, info, isArray) {
    let reData = []
    for (let componet of data) {
      let type = Object.prototype.toString.call(componet);
      if (type == '[object Object]') {
        reData.push(this.dealComponet(componet, info, isArray))
      } else if (type == '[object Array]') {
        var columnWrap = {
          ctype: 'panel',
          layout: 'column',
          bodyStyle: 'margin:0;',
          style: 'padding:0px;',
          width: 700,
          items: [this.dealData(componet, info, true)]
        }
        reData.push(columnWrap)
      }
    }
    return reData
  }
  //处理组件
  dealComponet(componet, info, isArray) {
    var cmp = this.componetMap(componet, info, isArray)
    return cmp
  }
  //英文拼接
  seten(data) {
    let reData = []
    for (let componet of data) {
      let type = Object.prototype.toString.call(componet);
      if (type == '[object Object]') {
        componet.en = this.enArr[componet.index].replace(/^ +| +$/g, '')
        delete componet.index
        reData.push(componet)
      } else if (type == '[object Array]') {
        reData.push(this.seten(componet))
      }
    }
    return reData
  }
  getIndex(data) {
    let reData = []
    for (let componet of data) {
      let type = Object.prototype.toString.call(componet);
      if (type == '[object Object]') {
        componet.index = this.indexNum
        this.indexNum = this.indexNum + 1
        reData.push(componet)
        this.enArr.push(componet.lang)
      } else if (type == '[object Array]') {
        reData.push(this.getIndex(componet))
      }
    }
    this.indexNum = 0
    return reData
  }
  //组件映射函数
  componetMap(componet, info, isArray) {
    let fieldLabel, lang;
    let en = componet.en.replace(/ /g, '_')
    let id = info.fatherName + '_' + info.name + '_' + info.Features + '_' + en
    if (info.lang === '') {
      lang = `lang_${info.fatherName}_${info.name}.`
      fieldLabel = `lang_${info.fatherName}_${info.name}.${en}`
    } else {
      lang = info.lang
      fieldLabel = `${lang}.${en}`
    }
    let langzh = fieldLabel + ' = \'' + componet.lang + '\''
    let langen = fieldLabel + ' = \'' + componet.en + '\''
    let getValue = 'var ' + en + ' = Ws.getCmt(\'' + id + '\').getValue()'
    let setValue = 'Ws.getCmt(\'' + id + '\').setValue()'
    this.langArrEn.push(langen)
    this.langArr.push(langzh)
    this.setArr.push(setValue)
    this.getArr.push(getValue)
    let labelWidth = info.labelWidth
    let width = info.width
    switch (componet.type) {
      case 'checkbox': {
        let checkbox = {
          ctype: 'checkbox',
          id: id,
          fieldLabel: fieldLabel,
          labelWidth: labelWidth,
          columnWidth: .3,
          width: width,
          listeners: `@{
                  'check': function (items, checked) {
                      if (checked) {

                      } else {

                      }
                  }
              }@`
        }
        if (isArray) {
          delete checkbox.width
        } else {
          delete checkbox.columnWidth
        }
        return checkbox
      }

      case 'combox': {
        let combox = {
          ctype: "combox",
          id: id,
          fieldLabel: fieldLabel,
          labelWidth: labelWidth,
          width: width,
          store: [['float&float&&static&static']],
          value: 'float',
          emptyText: '@lang_util.common_combox_emptyText@',
          getPagedData: `@function () {
                var func = {
                    head: {
                        'function': 'get_threat_disposal_type_list',
                        'module': 'threat_disposal',
                        'page_index': 1,
                        'page_size': 20
                    },
                    body: {

                    }
                };
                new Ws.ex.provider({
                    params: [func],
                    handler: function (data) {
                        if (data.head.error_code == 0) {
                            Ws.getCmt(${id}).loadData(data);
                        } else {
                            Ws.MessageBox.alert(lang_util.common_confirm, data.head.error_string);
                        }

                    }

                }).sender();
            }@`,
          listeners: `@{
                'click': function (checked) {
                },
                'select': function () {
                }
            }@`
        }

        if (isArray) {
          delete combox.width
        } else {
          delete combox.columnWidth
        }
        return combox
      }
      case 'combox2': {
        let combox2 = {
          ctype: "combox",
          id: id,
          fieldLabel: fieldLabel,
          labelWidth: labelWidth,
          width: width,
          store: [['float', 'float'], ['static', 'static']],
          value: 'float',
          emptyText: '@lang_util.common_combox_emptyText@',
        }

        if (isArray) {
          delete combox2.width
        } else {
          delete combox2.columnWidth
        }
        return combox2
      }
      case 'radiogroup':
        return {
          ctype: 'radiogroup',
          id: id,
          fieldLabel: fieldLabel,
          labelWidth: labelWidth,
          layout: 'column',
          items: [{
            ctype: 'radio',
            id: id + '_radio1',
            boxLabel: lang,
            checked: true,
            columnWidth: .5,
            name: 'serverType',
            inputValue: 'ftp',
            listeners: `@{
                      'check': function (item, checked) {
                          if (checked) {
                          }
                      }
                  }@`
          }, {
            ctype: 'radio',
            id: id + '_radio1',
            boxLabel: lang,
            columnWidth: .5,
            name: 'serverType',
            inputValue: 'tftp',
            listeners: `@{
                      'check': function (item, checked) {
                          if (checked) {
                          }
                      }
                  }@`
          }]
        }
      case 'textfield': {
        let textfield = {
          ctype: 'textfield',
          id: id,
          fieldLabel: fieldLabel,
          labelWidth: labelWidth,
          note: `lang_${info.fatherName}_${info.name}.`,
          reverseReg: false,
          columnWidth: .3,
          regExpObjFlag: 'description',
          allowBlank: true,
          width: width,
          minLength: 0,
          maxLength: 127
        }
        if (isArray) {
          delete textfield.width
        } else {
          delete textfield.columnWidth
        }
        return textfield
      }
      case 'ipmacfield': {
        let ipmacfield = {
          ctype: 'ipmacfield',
          id: id,
          hidden: false,
          fieldLabel: fieldLabel,
          labelWidth: labelWidth,
          emptyText: lang,
          helpNote: lang,
          width: width,
          columnWidth: .3,
          ipv6MaxMask: 64,
          ipv6MinMask: 32,
          segment: false,
          maskMustIn: false,
          type: 'ipv6',
        }
        if (isArray) {
          delete ipmacfield.width
        } else {
          delete ipmacfield.columnWidth
        }
        return ipmacfield
      }
      case 'numberfield': {
        let numberfield = {
          ctype: 'numberfield',
          id: id,
          fieldLabel: fieldLabel,
          labelWidth: labelWidth,
          value: '0',
          width: width,
          columnWidth: .3,
          isDisplayRange: false,
          note: lang,
          minValue: 0,
          maxValue: 50000
        };
        if (isArray) {
          delete numberfield.width
        } else {
          delete numberfield.columnWidth
        }
        return numberfield
      }
      case 'textarea':
        return {
          ctype: 'textarea',
          id: id,
          fieldLabel: fieldLabel,
          labelWidth: labelWidth,
          width: width,
          minLength: 0,
          maxLength: 255,
          allowBlank: true,
          note: lang,
          regExpObjFlag: 'description',
          noteBottom: true
        }
      case 'wsSwitch':
        return {
          ctype: 'wsSwitch',
          id: id,
          fieldLabel: fieldLabel,
          labelWidth: labelWidth,
          checked: true,
          listeners: `@{
                      'check': function (item, checked) {
                          if (checked) {
                          }
                      }
                  }@`
        }
      default:
        break;
    }
  }
}
function MD5(string) {
  function RotateLeft(lValue, iShiftBits) {
    return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
  }

  function AddUnsigned(lX, lY) {
    var lX4, lY4, lX8, lY8, lResult;
    lX8 = lX & 0x80000000;
    lY8 = lY & 0x80000000;
    lX4 = lX & 0x40000000;
    lY4 = lY & 0x40000000;
    lResult = (lX & 0x3fffffff) + (lY & 0x3fffffff);
    if (lX4 & lY4) {
      return lResult ^ 0x80000000 ^ lX8 ^ lY8;
    }
    if (lX4 | lY4) {
      if (lResult & 0x40000000) {
        return lResult ^ 0xc0000000 ^ lX8 ^ lY8;
      } else {
        return lResult ^ 0x40000000 ^ lX8 ^ lY8;
      }
    } else {
      return lResult ^ lX8 ^ lY8;
    }
  }

  function F(x, y, z) {
    return (x & y) | (~x & z);
  }
  function G(x, y, z) {
    return (x & z) | (y & ~z);
  }
  function H(x, y, z) {
    return x ^ y ^ z;
  }
  function I(x, y, z) {
    return y ^ (x | ~z);
  }

  function FF(a, b, c, d, x, s, ac) {
    a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
    return AddUnsigned(RotateLeft(a, s), b);
  }

  function GG(a, b, c, d, x, s, ac) {
    a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
    return AddUnsigned(RotateLeft(a, s), b);
  }

  function HH(a, b, c, d, x, s, ac) {
    a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
    return AddUnsigned(RotateLeft(a, s), b);
  }

  function II(a, b, c, d, x, s, ac) {
    a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
    return AddUnsigned(RotateLeft(a, s), b);
  }

  function ConvertToWordArray(string) {
    var lWordCount;
    var lMessageLength = string.length;
    var lNumberOfWords_temp1 = lMessageLength + 8;
    var lNumberOfWords_temp2 =
      (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
    var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
    var lWordArray = Array(lNumberOfWords - 1);
    var lBytePosition = 0;
    var lByteCount = 0;
    while (lByteCount < lMessageLength) {
      lWordCount = (lByteCount - (lByteCount % 4)) / 4;
      lBytePosition = (lByteCount % 4) * 8;
      lWordArray[lWordCount] =
        lWordArray[lWordCount] |
        (string.charCodeAt(lByteCount) << lBytePosition);
      lByteCount++;
    }
    lWordCount = (lByteCount - (lByteCount % 4)) / 4;
    lBytePosition = (lByteCount % 4) * 8;
    lWordArray[lWordCount] =
      lWordArray[lWordCount] | (0x80 << lBytePosition);
    lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
    lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
    return lWordArray;
  }

  function WordToHex(lValue) {
    var WordToHexValue = "",
      WordToHexValue_temp = "",
      lByte,
      lCount;
    for (lCount = 0; lCount <= 3; lCount++) {
      lByte = (lValue >>> (lCount * 8)) & 255;
      WordToHexValue_temp = "0" + lByte.toString(16);
      WordToHexValue =
        WordToHexValue +
        WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
    }
    return WordToHexValue;
  }

  function Utf8Encode(string) {
    string = string.replace(/\r\n/g, "\n");
    var utftext = "";

    for (var n = 0; n < string.length; n++) {
      var c = string.charCodeAt(n);

      if (c < 128) {
        utftext += String.fromCharCode(c);
      } else if (c > 127 && c < 2048) {
        utftext += String.fromCharCode((c >> 6) | 192);
        utftext += String.fromCharCode((c & 63) | 128);
      } else {
        utftext += String.fromCharCode((c >> 12) | 224);
        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
        utftext += String.fromCharCode((c & 63) | 128);
      }
    }

    return utftext;
  }

  var x = Array();
  var k, AA, BB, CC, DD, a, b, c, d;
  var S11 = 7,
    S12 = 12,
    S13 = 17,
    S14 = 22;
  var S21 = 5,
    S22 = 9,
    S23 = 14,
    S24 = 20;
  var S31 = 4,
    S32 = 11,
    S33 = 16,
    S34 = 23;
  var S41 = 6,
    S42 = 10,
    S43 = 15,
    S44 = 21;

  string = Utf8Encode(string);

  x = ConvertToWordArray(string);

  a = 0x67452301;
  b = 0xefcdab89;
  c = 0x98badcfe;
  d = 0x10325476;

  for (k = 0; k < x.length; k += 16) {
    AA = a;
    BB = b;
    CC = c;
    DD = d;
    a = FF(a, b, c, d, x[k + 0], S11, 0xd76aa478);
    d = FF(d, a, b, c, x[k + 1], S12, 0xe8c7b756);
    c = FF(c, d, a, b, x[k + 2], S13, 0x242070db);
    b = FF(b, c, d, a, x[k + 3], S14, 0xc1bdceee);
    a = FF(a, b, c, d, x[k + 4], S11, 0xf57c0faf);
    d = FF(d, a, b, c, x[k + 5], S12, 0x4787c62a);
    c = FF(c, d, a, b, x[k + 6], S13, 0xa8304613);
    b = FF(b, c, d, a, x[k + 7], S14, 0xfd469501);
    a = FF(a, b, c, d, x[k + 8], S11, 0x698098d8);
    d = FF(d, a, b, c, x[k + 9], S12, 0x8b44f7af);
    c = FF(c, d, a, b, x[k + 10], S13, 0xffff5bb1);
    b = FF(b, c, d, a, x[k + 11], S14, 0x895cd7be);
    a = FF(a, b, c, d, x[k + 12], S11, 0x6b901122);
    d = FF(d, a, b, c, x[k + 13], S12, 0xfd987193);
    c = FF(c, d, a, b, x[k + 14], S13, 0xa679438e);
    b = FF(b, c, d, a, x[k + 15], S14, 0x49b40821);
    a = GG(a, b, c, d, x[k + 1], S21, 0xf61e2562);
    d = GG(d, a, b, c, x[k + 6], S22, 0xc040b340);
    c = GG(c, d, a, b, x[k + 11], S23, 0x265e5a51);
    b = GG(b, c, d, a, x[k + 0], S24, 0xe9b6c7aa);
    a = GG(a, b, c, d, x[k + 5], S21, 0xd62f105d);
    d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
    c = GG(c, d, a, b, x[k + 15], S23, 0xd8a1e681);
    b = GG(b, c, d, a, x[k + 4], S24, 0xe7d3fbc8);
    a = GG(a, b, c, d, x[k + 9], S21, 0x21e1cde6);
    d = GG(d, a, b, c, x[k + 14], S22, 0xc33707d6);
    c = GG(c, d, a, b, x[k + 3], S23, 0xf4d50d87);
    b = GG(b, c, d, a, x[k + 8], S24, 0x455a14ed);
    a = GG(a, b, c, d, x[k + 13], S21, 0xa9e3e905);
    d = GG(d, a, b, c, x[k + 2], S22, 0xfcefa3f8);
    c = GG(c, d, a, b, x[k + 7], S23, 0x676f02d9);
    b = GG(b, c, d, a, x[k + 12], S24, 0x8d2a4c8a);
    a = HH(a, b, c, d, x[k + 5], S31, 0xfffa3942);
    d = HH(d, a, b, c, x[k + 8], S32, 0x8771f681);
    c = HH(c, d, a, b, x[k + 11], S33, 0x6d9d6122);
    b = HH(b, c, d, a, x[k + 14], S34, 0xfde5380c);
    a = HH(a, b, c, d, x[k + 1], S31, 0xa4beea44);
    d = HH(d, a, b, c, x[k + 4], S32, 0x4bdecfa9);
    c = HH(c, d, a, b, x[k + 7], S33, 0xf6bb4b60);
    b = HH(b, c, d, a, x[k + 10], S34, 0xbebfbc70);
    a = HH(a, b, c, d, x[k + 13], S31, 0x289b7ec6);
    d = HH(d, a, b, c, x[k + 0], S32, 0xeaa127fa);
    c = HH(c, d, a, b, x[k + 3], S33, 0xd4ef3085);
    b = HH(b, c, d, a, x[k + 6], S34, 0x4881d05);
    a = HH(a, b, c, d, x[k + 9], S31, 0xd9d4d039);
    d = HH(d, a, b, c, x[k + 12], S32, 0xe6db99e5);
    c = HH(c, d, a, b, x[k + 15], S33, 0x1fa27cf8);
    b = HH(b, c, d, a, x[k + 2], S34, 0xc4ac5665);
    a = II(a, b, c, d, x[k + 0], S41, 0xf4292244);
    d = II(d, a, b, c, x[k + 7], S42, 0x432aff97);
    c = II(c, d, a, b, x[k + 14], S43, 0xab9423a7);
    b = II(b, c, d, a, x[k + 5], S44, 0xfc93a039);
    a = II(a, b, c, d, x[k + 12], S41, 0x655b59c3);
    d = II(d, a, b, c, x[k + 3], S42, 0x8f0ccc92);
    c = II(c, d, a, b, x[k + 10], S43, 0xffeff47d);
    b = II(b, c, d, a, x[k + 1], S44, 0x85845dd1);
    a = II(a, b, c, d, x[k + 8], S41, 0x6fa87e4f);
    d = II(d, a, b, c, x[k + 15], S42, 0xfe2ce6e0);
    c = II(c, d, a, b, x[k + 6], S43, 0xa3014314);
    b = II(b, c, d, a, x[k + 13], S44, 0x4e0811a1);
    a = II(a, b, c, d, x[k + 4], S41, 0xf7537e82);
    d = II(d, a, b, c, x[k + 11], S42, 0xbd3af235);
    c = II(c, d, a, b, x[k + 2], S43, 0x2ad7d2bb);
    b = II(b, c, d, a, x[k + 9], S44, 0xeb86d391);
    a = AddUnsigned(a, AA);
    b = AddUnsigned(b, BB);
    c = AddUnsigned(c, CC);
    d = AddUnsigned(d, DD);
  }

  var temp = WordToHex(a) + WordToHex(b) + WordToHex(c) + WordToHex(d);

  return temp.toLowerCase();
}
//克隆方法
function clone(data) {
  return JSON.parse(JSON.stringify(data));
}
function transitionJsonToString (jsonObj, callback) {
	// 转换后的jsonObj受体对象
	var _jsonObj = null;
	// 判断传入的jsonObj对象是不是字符串，如果是字符串需要先转换为对象，再转换为字符串，这样做是为了保证转换后的字符串为双引号
	if (Object.prototype.toString.call(jsonObj) !== "[object String]") {
		try {
			_jsonObj = JSON.stringify(jsonObj);
		} catch (error) {
			// 转换失败错误信息
			console.error('您传递的json数据格式有误，请核对...');
			console.error(error);
			callback(error);
		}
	} else {
		try {
			jsonObj = jsonObj.replace(/(\')/g, '\"');
			_jsonObj = JSON.stringify(JSON.parse(jsonObj));
		} catch (error) {
			// 转换失败错误信息
			console.error('您传递的json数据格式有误，请核对...');
			console.error(error);
			callback(error);
		}
	}
	return _jsonObj;
}
// callback为数据格式化错误的时候处理函数
function formatJson (jsonObj, callback) {
	// 正则表达式匹配规则变量
	var reg = null;
	// 转换后的字符串变量
	var formatted = '';
	// 换行缩进位数
	var pad = 0;
	// 一个tab对应空格位数
	var PADDING = '    ';
	// json对象转换为字符串变量
	var jsonString = transitionJsonToString(jsonObj, callback);
	if (!jsonString) {
		return jsonString;
	}
	// 存储需要特殊处理的字符串段
	var _index = [];
	// 存储需要特殊处理的“再数组中的开始位置变量索引
	var _indexStart = null;
	// 存储需要特殊处理的“再数组中的结束位置变量索引
	var _indexEnd = null;
	// 将jsonString字符串内容通过\r\n符分割成数组
	var jsonArray = [];
    // 正则匹配到{,}符号则在两边添加回车换行
	jsonString = jsonString.replace(/([\{\}])/g, '\r\n$1\r\n');
	// 正则匹配到[,]符号则在两边添加回车换行
	jsonString = jsonString.replace(/([\[\]])/g, '\r\n$1\r\n');
	// 正则匹配到,符号则在两边添加回车换行
	jsonString = jsonString.replace(/(\,)/g, '$1\r\n');
	// 正则匹配到要超过一行的换行需要改为一行
	jsonString = jsonString.replace(/(\r\n\r\n)/g, '\r\n');
	// 正则匹配到单独处于一行的,符号时需要去掉换行，将,置于同行
	jsonString = jsonString.replace(/\r\n\,/g, ',');
	// 特殊处理双引号中的内容
	jsonArray = jsonString.split('\r\n');
	jsonArray.forEach(function (node, index) {
		// 获取当前字符串段中"的数量
		var num = node.match(/\"/g) ? node.match(/\"/g).length : 0;
		// 判断num是否为奇数来确定是否需要特殊处理
		if (num % 2 && !_indexStart) {
			_indexStart = index
		}
		if (num % 2 && _indexStart && _indexStart != index) {
			_indexEnd = index
		}
		// 将需要特殊处理的字符串段的其实位置和结束位置信息存入，并对应重置开始时和结束变量
		if (_indexStart && _indexEnd) {
			_index.push({
				start: _indexStart,
				end: _indexEnd
			})
			_indexStart = null
			_indexEnd = null
		}
	})
	// 开始处理双引号中的内容，将多余的"去除
	_index.reverse().forEach(function (item, index) {
		var newArray = jsonArray.slice(item.start, item.end + 1)
		jsonArray.splice(item.start, item.end + 1 - item.start, newArray.join(''))
	})
	// 奖处理后的数组通过\r\n连接符重组为字符串
	jsonString = jsonArray.join('\r\n');
	// 将匹配到:后为回车换行加大括号替换为冒号加大括号
	jsonString = jsonString.replace(/\:\r\n\{/g, ':{');
	// 将匹配到:后为回车换行加中括号替换为冒号加中括号
	jsonString = jsonString.replace(/\:\r\n\[/g, ':[');
	// 将上述转换后的字符串再次以\r\n分割成数组
	jsonArray = jsonString.split('\r\n');
    // 将转换完成的字符串根据PADDING值来组合成最终的形态
    jsonArray.forEach(function (item, index) {
		// console.log(item)
    	var i = 0;
    	// 表示缩进的位数，以tab作为计数单位
		var indent = 0;
		// 表示缩进的位数，以空格作为计数单位
		var padding = '';
		if (item.match(/\{$/) || item.match(/\[$/)) {
			// 匹配到以{和[结尾的时候indent加1
			indent += 1
		} else if (item.match(/\}$/) || item.match(/\]$/) || item.match(/\},$/) || item.match(/\],$/)) {
			// 匹配到以}和]结尾的时候indent减1
			if (pad !== 0) {
				pad -= 1
			}
        } else {
            indent = 0
        }
        for (i = 0; i < pad; i++) {
            padding += PADDING
        }
        formatted += padding + item + '\r\n'
		pad += indent
   	})
	// 返回的数据需要去除两边的空格
	return formatted.trim();
}
export {
  formatJson,
  MD5,
  clone,
  WSC,
} 
