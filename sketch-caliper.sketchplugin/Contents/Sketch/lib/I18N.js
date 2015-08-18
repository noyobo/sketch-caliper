var I18NMap = {}

var lang = NSUserDefaults.standardUserDefaults().objectForKey("AppleLanguages").objectAtIndex(0)

var I18NMap = {
  "en": {
    NAME: 'Sketch Caliper',
  },
  "zh-Hans": {
    NAME: 'Sketch Caliper',
    NOT_ARTBOARDS: '至少含有一个画板╮(╯▽╰)╭',
    OK: '确定',
    CANCEl: '取消',
    EXPORT: '导出',
    EXPORT_LABEL: '导出到:',
    EXPORT_COMPLETE: "导出完毕(●'◡'●)ﾉ♥"
  }
}

var I18N = I18NMap[lang]
