'use strict'
var React = require('react')
var Grid = require('react-bootstrap').Grid
var Row = require('react-bootstrap').Row
var Col = require('react-bootstrap').Col
var Sparklines = require('react-sparklines').Sparklines
var SparklinesLine = require('react-sparklines').SparklinesLine
var SparklinesBars = require('react-sparklines').SparklinesBars
var moment = require('moment')

// need to require css or browserify doesn't pull in the bootstrap stuff
var css = require('../../css/app.css')

var AppDispatcher = require('../dispatcher/Dispatcher')
var ActionTypes = require('../enums/ActionTypes')
var UrlDataStore = require('../stores/UrlDataStore')
var ConfigStore = require('../stores/ConfigStore')
var MetaStore = require('../stores/MetaStore')

var App = React.createClass({
  _onChange: function () {
    console.log('_onChange')
    var config = ConfigStore.get()
    this.setState({
      tsd: UrlDataStore.get(),
      meta: MetaStore.get()
    })
  },
  getInitialState: function () {
    console.log('getInitialState fired')
    var config = ConfigStore.get()
    return { config: config }
  },
  componentDidMount: function () {
    UrlDataStore.init('')
    MetaStore.init()
    ConfigStore.addChangeListener(this._onChange)
    UrlDataStore.addChangeListener(this._onChange)
    MetaStore.addChangeListener(this._onChange)
  },
  componentWillUpdate: function (nextProps, nextState) {
    console.log('componentWillUpdate fired')
  },
  componentDidUpdate: function (prevProps, prevState) {
    console.log('componentDidUpdate fired')
  },
  componentWillUnmount: function () {
    console.log('componentWillUnmount fired')
    ConfigStore.removeChangeListener(this._onChange)
    UrlDataStore.removeChangeListener(this._onChange)
    MetaStore.removeChangeListener(this._onChange)
  },

  render: function () {
    var data = this.state.tsd || { global: { res: [], enl: [] },
      player: {'one': []},teams: {res: {}, enl: {} }}

    var pRes = []
    var pEnl = []
    var p3Fac = []
    var plRes = []
    var plEnl = []
    var pl3Fac = []
    var raw = []
    var player = null

    for (player in data.player) {
      raw.push({player: player, data: data.player[player]})
    }

    raw.sort(function (a, b) {
      return b.data.length - a.data.length
    }).forEach(function (player) {
      if (player.player in data.teams['res']) {
        pRes.push(player)
      } else if (player.player in data.teams['enl']) {
        pEnl.push(player)
      } else {
        p3Fac.push(player)
      }
    })
    var stroke = null
    pRes.forEach(function (player) {
      stroke = '#336aff'
      plRes.push(<div><div width="40">{player.player}</div><Sparklines data={player.data}><SparklinesLine style={{strokeWidth: 3, stroke: stroke, fill: 'none'}}/></Sparklines></div>)
    })
    pEnl.forEach(function (player) {
      stroke = '#33ff6a'
      plEnl.push(<div><div width="40">{player.player}</div><Sparklines data={player.data}><SparklinesLine style={{strokeWidth: 3, stroke: stroke, fill: 'none'}}/></Sparklines></div>)
    })
    p3Fac.forEach(function (player) {
      stroke = '#6a6a6a'
      pl3Fac.push(<div><div width="40">{player.player}</div><Sparklines data={player.data}><SparklinesLine style={{strokeWidth: 3, stroke: stroke, fill: 'none'}}/></Sparklines></div>)
    })
    var meta = this.state.meta || {alerts: []}
    var alerts = []
    meta.alerts.forEach(function (a) {
      alerts.push(<div>{moment(a.time).fromNow()} {a.player} kw: {a.alert}  <a href={a.link}>{a.portal}</a></div>)
    })

    return (
    <div>
        <Grid>
          <Row>
            <Col xs={6}><h1><small>Res : {meta && meta.res || 0 } Enl : {meta && meta.enl || 0}</small></h1></Col>
            <Col xs={6} className="bg-danger">{alerts}</Col>
            </Row>
          <Row className="show-grid">
            <Col xs={12} md={8}>
                <Sparklines data={data.global.res} width={500} height={100} margin={5}>
                   <SparklinesLine style={{ strokeWidth: 3, stroke: '#336aff', fill: 'none' }}/>
                 </Sparklines>
            </Col>
            <Col xs={12} md={8}>
              <Sparklines data={data.global.enl} width={500} height={100} margin={5}>
               <SparklinesLine style={{ strokeWidth: 3, stroke: '#33ff6a', fill: 'none', fillOpacity: '.9'}}/>
             </Sparklines>
            </Col>
          </Row>
          <Row>
            <Col xs={6} md={8}>
              {plRes}
            </Col>
            <Col xs={6} md={8}>
              {plEnl}
            </Col>
          </Row>
          <Row>
            <Col xs={6} md={8}>
              {pl3Fac}
            </Col>
          </Row>
      ​  </Grid>
     </div>
    )
  }
})

exports = module.exports = App
