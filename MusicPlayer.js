// MusicPlayer.js

const slashOrBack= /\/|\\/
const audioFormats= ['.mp3']
const displayStates= Object.freeze({
  'none': 'none',
  'some': 'some',
  'all': 'all'
})

var app
var thePlayer

class DirNode {
  constructor(name, parent) {
    this.name= name
    this.parent= parent

    this.dirs= {}
    this.tracks= {}
    this.dirArray= []
    this.trackArray= []

    this.expanded= true

    this.includedToggle= true
    this.inclusionDisplay= displayStates.all
    this.inclusionResult= false
  }

  calculateInclusionDisplay() {
    if (!this.includedToggle) {
      this.inclusionDisplay= displayStates.none
      return
    }

    let anyOn= false, anyOff= false
    for (dirName in this.dirs) {
      let dir= this.dirs[dirName]
      dir.calculateInclusionDisplay()
      switch (dir.inclusionDisplay) {
        case displayStates.none:
          anyOff= true
          break
        case displayStates.some:
          anyOn= true
          anyOff= true
          break
        case displayStates.all:
          anyOn= true
          break
        default:
          console.error(`State ${dir.inclusionDisplay} of ${dir.name} unrecognized.`)
      }
    }
    for (trackName in this.tracks) {
      let track = this.tracks[trackName]
      if (track.includedToggle) {
        anyOn= true
      } else {
        anyOf= true
      }
    }

    // as is, inclusionDisplay doesn't depend at all on the local anyOn variable
    if (anyOff) {
      this.inclusionDisplay= displayStates.some
      return
    }
    this.inclusionDisplay= displayStates.all
  }
  calculateInclusionResult() {
    let p= this
    while (p != null) {
      if (!p.includedToggle) {
        this.inclusionResult= false
        return
      }
    }
    this.inclusionResult= true
  }
  calculateInclusionResultRecursively(doomed) {
    if (doomed || !this.includedToggle) {
      this.inclusionResult= false
    } else {
      this.inclusionResult= true
    }
    for (dirName in this.dirs) {
      this.dirs[dirName].calculateInclusionResultRecursively(!this.inclusionResult)
    }
    for (trackName in this.tracks) {
      this.tracks[trackName].calculateInclusionResultRecursively(!this.inclusionResult)
    }
  }
}

class TrackNode {
  constructor(file, parent) {
    this.name= file.webkitRelativePath.split(slashOrBack).slice(-1)[0]
    this.file= file
    this.parent= parent

    this.includedToggle= true
    this.inclusionResult= false
  }
  calculateInclusionResult() {
    if (!this.includedToggle) {
      this.inclusionResult= false
      return
    }
    let p= this.parent
    while (p != null) {
      if (!p.includedToggle) {
        this.inclusionResult= false
        return
      }
    }
    this.inclusionResult= true
  }
  calculateInclusionResultRecursively(doomed) {
    this.inclusionResult= this.includedToggle && !doomed
  }
}

$(()=> {
  thePlayer= $('#the-player')[0]

  Vue.component('track-tree', {
    template: '#track-tree-template',
    props: ['itself', 'name'],
    methods: {
      toggleExpanded() {
        this.itself.expanded= !this.itself.expanded
      },
      toggleInclusion() {
        this.itself.includedToggle= !this.itself.includedToggle
        app.library.calculateInclusionDisplay()
        app.library.calculateInclusionResultRecursively()
      }
    }
  })
  
  app= new Vue({
    el: '#app',
    data: {
      library: new DirNode('Library', null),
    },
    methods: {
      openFolder() {
        let folderInput= $('#folder-input')[0]
        let files= folderInput.files
        for (file of files) {
          if (audioFormats.some(af=> file.name.endsWith(af))) {
            let path= file.webkitRelativePath.split(slashOrBack).slice(0, -1)
            let fileName= file.webkitRelativePath.split(slashOrBack).slice(-1)[0]
            let subLibrary= app.library
            for (pathPart of path) {
              if (!(pathPart in subLibrary.dirs)) {
                subLibrary.dirs[pathPart]= new DirNode(pathPart, subLibrary)
              }
              subLibrary= subLibrary.dirs[pathPart]
            }
            subLibrary.tracks[fileName]= new TrackNode(file, subLibrary)
          }
        }
        folderInput.value= null
        app.forgeLibraryArrays(app.library)
        app.library.calculateInclusionDisplay()
      },
      forgeLibraryArrays(subLibrary) {
        todo= [subLibrary]
        while (todo.length > 0) {
          node= todo.pop()
          node.dirArray= []
          node.trackArray= []
          for (dirName in node.dirs) {
            node.dirArray.push(node.dirs[dirName])
            todo.push(node.dirs[dirName])
          }
          sortByKey(node.dirArray, 'name')
          for (trackName in node.tracks) {
            node.trackArray.push(node.tracks[trackName])
          }
          sortByKey(node.trackArray, 'name')
        }
      },
      setTrack(file) {
        thePlayer.src= URL.createObjectURL(file)
      },
    },
  })

  // folderInput.onchange= ()=> {
  //   app.openFolder()
  //   // let files= folderInput.files
  //   // for (file of files) {
  //   //   if (audioFormats.some(af=> file.name.endsWith(af))) {
  //   //     let path= file.webkitRelativePath.split(slashOrBack).slice(0, -1)
  //   //     let fileName= file.webkitRelativePath.split(slashOrBack).slice(-1)[0]
  //   //     for (pathIndex in path) {
  //   //       let prePath = path.slice(0, pathIndex)
  //   //       let subLibrary = library
  //   //       for (prePathPart of prePath) {
  //   //         subLibrary= subLibrary[prePathPart]
  //   //       }
  //   //       if (!(path[pathIndex] in subLibrary)) {
  //   //         subLibrary[path[pathIndex]]= {}
  //   //       }
  //   //     }
  //   //     let subLibrary= library
  //   //     for (pathPart of path) {
  //   //       subLibrary= subLibrary[pathPart]
  //   //     }
  //   //     subLibrary[fileName]= file
  //   //   }
  //   // }
  //   // folderInput.value = null
  // }
})

function sortByKey(array, key) {
  array.sort(
    (a, b)=>
      a[key] < b[key]
        ? -1
        : a[key] > b[key]
          ? 1
          : 0
  )
}