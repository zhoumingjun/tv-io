<template>
<div>
    <div class="columns">
        <div class="column is-10">
              <div class="dropzone-area">
                <div class="dropzone-text">
                    <span class="dropzone-title" v-if="!selectedDir" >Drop directory here or click to select</span>
                    <span class="dropzone-info" v-if="selectedDir">{{ selectedDir }}</span>
                </div>
                <input type="file" @change="onFileChange" webkitdirectory>
            </div>
        </div>
        <div class="column is-2">
            <a class="button is-primary" @click="onValidate">validate</a>
        </div>

    </div>
       <section class="section">
            <table class="table is-bordered ">
                  <tbody>
                <tr v-for="(series, seriesindex) in serieses">
                    <td>
                        {{series.seriespath}}  <a class="button is-focused" @click="open(series)">{{series.isOpen ? "-" : "+" }}</a>
                        <table class="table is-bordered " v-show="series.isOpen">
                            <tbody>
                            <tr v-for="(movie, movieindex) in series.movie">
                                <td>
                                    {{movie.name}}
                                </td>
                            </tr>
                            </tbody>

                        </table>
                    </td>
                </tr>
                  </tbody>

            </table>
        </section>
    </div>
</template>

<script>

export default {
  name: 'home',
  data () {
    return {
      selectedDir: '/Volumes/TVContent/metadata_error',
      hovering: false,
      serieses: []
    }
  },

  methods: {
    onFileChange (e) {
      var files = e.target.files || e.dataTransfer.files
      if (!files.length) {
        return
      } else {
        console.log(files)
        this.selectedDir = files[0].path
      }
    },

    onValidate () {
      var fs = this.$electron.remote.require('fs')
      var path = this.$electron.remote.require('path')
      var fileExists = this.$electron.remote.require('file-exists')

      var dirs = fs.readdirSync(this.selectedDir)
      for (let k in dirs) {
        var dir = path.join(this.selectedDir, dirs[k])
        if (fs.statSync(dir).isDirectory()) {
          var seriespath = path.join(dir, 'series.csv')
          var moviepath = path.join(dir, 'movie.csv')
          if (fileExists.sync(seriespath) && fileExists.sync(moviepath)) {
            var series = {}
            var movie = []
            series = {seriespath, moviepath, series, movie, isOpen: false}
            this.serieses.push(series)
            this.handleSeries(this.$electron, series)
            this.handleMovies(this.$electron, series)
          }
        }
      }
    },
    open (series) {
      series.isOpen = !series.isOpen
    },
    handleSeries (electron, series) {
      console.log('handle', series.seriespath)
      var csv = electron.remote.require('csv')
      var fs = electron.remote.require('fs')
      var input = fs.createReadStream(series.seriespath)
      var parser = csv.parse({trim: true})

      var output = []
      parser.on('readable', function () {
        while (true) {
          let record = parser.read()
          if (record) {
            output.push(record)
          } else {
            break
          }
        }
      })
      parser.on('error', function (err) {
        console.log(err.message)
      })
      parser.on('finish', function () {
        for (let idx in output[0]) {
          series.series[output[0][idx]] = output[1][idx]
        }
        console.log(series)
        console.log(series.serires)
      })

      input.pipe(parser)
    },

    handleMovies (electron, series) {
      console.log('handle', series.moviepath)
      var csv = electron.remote.require('csv')
      var fs = electron.remote.require('fs')
      var input = fs.createReadStream(series.moviepath)
      var parser = csv.parse()

      var output = []
      parser.on('readable', function () {
        while (true) {
          let record = parser.read()
          if (record) {
            output.push(record)
          } else {
            break
          }
        }
      })
      parser.on('error', function (err) {
        console.log(err.message)
      })
      parser.on('finish', function () {
        for (let idx = 2; idx < output.length; idx++) {
          var movie = {}
          for (let k in output[0]) {
            console.log(k, output[0][k], output[idx][k])
            movie[output[0][k]] = output[idx][k]
          }
          series.movie.push(movie)
        }
      })

      input.pipe(parser)
    }
  }

}
</script>

<style lang='scss' scoped>
.dropzone-area {
    width: 80%;
    height: 50px;
    position: relative;
    border: 2px dashed #CBCBCB;
    &.hovered {
        border: 2px dashed #2E94C4;
        .dropzone-title {
          color: #1975A0;
        }
    }
}

.dropzone-area input {
    position: absolute;
    cursor: pointer;
    top: 0px;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
}

.dropzone-text {
    position: absolute;
    top: 50%;
    text-align: center;
    transform: translate(0, -50%);
    width: 100%;
    span {
        display: block;
        font-family: Arial, Helvetica;
        line-height: 1.9;
    }
}

.dropzone-title {
    font-size: 13px;
    color: #787878;
    letter-spacing: 0.4px;
}
.dropzone-info {
    font-size: 13px;
    font-size: 0.8125rem;
    color: #A8A8A8;
    letter-spacing: 0.4px;
}

.dropzone-button {
    position: absolute;
    top: 10px;
    right: 10px;
    display: none;
}

.dropzone-preview {
    width: 80%;
    position: relative;
    &:hover .dropzone-button {
        display: block;
    }
    img {
      display: block;
      height: auto;
      max-width: 100%;
    }

}
</style>
