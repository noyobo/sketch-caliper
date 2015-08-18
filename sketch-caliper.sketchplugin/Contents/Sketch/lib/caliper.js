var caliper = {
  init: function(context) {
    this.context = context
    this.document = context.document
    this.page = this.document.currentPage()
    this.artboard = this.page.currentArtboard()
    this.selection = context.selection
  },
  export: function() {
    var artboards = this.find(this.page, MSArtboardGroup)
    if (artboards.count() === 0) {
      this.alert(I18N.NOT_ARTBOARDS)
      return false
    }
    var artboardsData = []
    artboards = artboards.objectEnumerator()

    var savePath = this.getSavePath()
    if (!savePath) {
      return false
    }

    var artboardsPath = savePath.stringByAppendingPathComponent('artboards');
    [[NSFileManager defaultManager] createDirectoryAtPath:artboardsPath withIntermediateDirectories:true attributes:nil error:nil];

    while (msArtboard = artboards.nextObject()) {
      var artboardId = msArtboard.objectID()
      var artboardName = msArtboard.name()
      var artboardFrame = msArtboard.frame()
      var layerItems = msArtboard.children().objectEnumerator()

      var relativePath = this.writeImage(artboardsPath, msArtboard)

      // var imageBase64 = this.layerConvertBase64(msArtboard)
      var artboardData = {
        'id': this.toJSString(artboardId),
        'name': this.toJSString(artboardName),
        'width': artboardFrame.width(),
        'height': artboardFrame.height(),
        'bgImage': this.toJSString(relativePath)
      }
      artboardsData.push(artboardData)
    }

    var artboardsJsonData = NSString.stringWithString(JSON.stringify(artboardsData))
    this.writeFile(savePath, 'artboards.js', artboardsJsonData)
    
    this.message(I18N.EXPORT_COMPLETE)
  },
  /**
   * 查找画板资源
   * @return {Array}            NSArray
   */
  find: function(container, name, field) {
    var field = field || 'class'
    if (typeof container === 'undefined' || container == nil) {
      return NSArray.array()
    }
    var predicate = NSPredicate.predicateWithFormat('(' + field + ' == %@)', name)
    var scope = container.children()
    return scope.filteredArrayUsingPredicate(predicate)
  },
  toJSString: function(str) {
    return new String(str).toString()
  },
  // 文件存储相关
  getSavePath: function() {
    var filePath = this.document.fileURL() ? this.document.fileURL().path().stringByDeletingLastPathComponent() : "~"
    var fileName = this.document.displayName().stringByDeletingPathExtension()
    var savePanel = NSSavePanel.savePanel()

    savePanel.setTitle(I18N.NAME)
    savePanel.setNameFieldLabel(I18N.EXPORT_LABEL)
    savePanel.setPrompt(I18N.EXPORT)
    savePanel.setCanCreateDirectories(true)
    savePanel.setNameFieldStringValue(fileName)

    if (savePanel.runModal() != NSOKButton) {
      return false
    }

    var savePathUrl = savePanel.URL().path()

    [[NSFileManager defaultManager]
      createDirectoryAtPath: savePathUrl
      withIntermediateDirectories: true
      attributes: nil
      error: nil]

    return savePathUrl
  },
  // 写入文件
  writeFile: function(basepath, filename, context) {
    var fileUrl = basepath.stringByAppendingPathComponent(filename)

    [context writeToFile: fileUrl
      atomically: false
      encoding: NSUTF8StringEncoding
      error: nil
    ]
  },
  // 写入图片
  writeImage: function(basepath, layer, suffix){
    var document = this.document
    var suffix = suffix || 'png'
    var imageFileName = layer.objectID() + '.' + suffix
    var imageFilePath = basepath.stringByAppendingPathComponent(imageFileName)

    var rect = layer.absoluteInfluenceRect()
    var slice = [[MSSliceMaker slicesFromExportableLayer: layer inRect: rect] firstObject]

    slice.format = suffix;
    slice.scale = 2

    [[MSSliceExporter dataForRequest: slice] 
      writeToFile:imageFilePath
      atomically:true]
    return imageFileName;
  },
  // 转换 artboard to base64 png
  layerConvertBase64: function(msArtboard) {
    var document = this.document
    var imageFileName = msArtboard.objectID() + '.png'
    var imagePath = this.toJSString(NSTemporaryDirectory().stringByAppendingPathComponent(imageFileName))

    [document saveArtboardOrSlice: msArtboard toFile: imagePath]

    var imageURL = NSURL.fileURLWithPath(imagePath)
    var imageData = NSData.dataWithContentsOfURL(imageURL)
    var imageBase64 = imageData.base64EncodedStringWithOptions(0)

    return imageBase64
  },
    // 用户询问及提示
  message: function(message) {
    this.document.showMessage(message)
  },
  alert: function(message) {
    var alert = NSAlert.alloc().init()
    alert.setMessageText(I18N.NAME)
    alert.setInformativeText(message)
    alert.addButtonWithTitle(I18N.OK)
    return alert.runModal()
  },
  confirm: function(message) {
    var confirm = NSAlert.alloc().init()
    confirm.setMessageText(I18N.NAME)
    confirm.setInformativeText(message)
    confirm.addButtonWithTitle(I18N.OK)
    confirm.addButtonWithTitle(I18N.CANCEl)
    return confirm.runModal()
  }
}
