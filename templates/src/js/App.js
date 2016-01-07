var React = require('react');
var Dropzone = require('react-dropzone');
var superagent = require('superagent');

var Router = require('react-router').Router;
var Route = require('react-router').Route;
var Link = require('react-router').Link;
var History = require('react-router').History;
var Lifecycle = require('react-router').Lifecycle;

var createHistory = require('history').createHistory;
var useBasename = require('history').useBasename;

var history = useBasename(createHistory)({
  basename: '/transitions'
});

var Dz = React.createClass({
  getInitialState: function() {
    return {
      files: [],
      jobTitle: "",
      skills: "",
      other1: "",
      other1value: "",
      other2: "",
      other2value: "",
      other3: "",
      other3value: "",
    }
  },

  componentDidMount: function(){
    this.setState({files: this.state.files});
  },

  handleChange1: function(e) {
    this.setState({jobTitle: e.target.value});
  },

  handleChange2: function(e) {
    this.setState({skills: e.target.value});
  },

  handleChange3: function(e) {
    this.setState({other1: e.target.value});
  },

  handleChange4: function(e) {
    this.setState({other1value: e.target.value});
  },

  handleChange5: function(e) {
    this.setState({other2: e.target.value});
  },

  handleChange6: function(e) {
    this.setState({other2value: e.target.value});
  },

  handleChange7: function(e) {
    this.setState({other3: e.target.value});
  },

  handleChange8: function(e) {
    this.setState({other3value: e.target.value});
  },

  onDrop: function(files) {
    this.setState({files: files})
  },

  render: function() {
    var dzStyle = {
      margin: "auto",
      fontSize: 20,
      width: 200,
      height: 150,
      borderWidth: 2,
      borderColor: '#003d7c',
      borderStyle: 'dashed',
      borderRadius: 5,
      padding: "10px",
      color: "white"
    };

    var parentStyle = {
      color: "white"
    };

    var inputStyle = {
      padding: 10,
      border: "none",
      borderBottom: "solid 2px #c9c9c9",
      transition: "border 0.3s"
    };

    var keyStyle = {
      textAlign: "left"
    };

    var tableStyle = {
      marginLeft: "auto",
      marginRight: "auto"
    };

    return (
      <div>
        <div>
          <table style={tableStyle}>
            <tr>
              Who are you looking for?<br /><br />
            </tr>
            <tr>
              <td style={keyStyle}>Job Title:</td>
              <td><input type="text" value={this.state.jobTitle} placeholder="e.g. Software Engineer" style={inputStyle} onChange={this.handleChange1} /></td>
            </tr>
            <tr>
              <td style={keyStyle}>Skills (separate by comma):</td>
              <td><input type="text" value={this.state.skills} placeholder="e.g. iOS, js, python" style={inputStyle} onChange={this.handleChange2} /></td>
            </tr>
            <tr>
              <td style={keyStyle}><br />Others:</td>
            </tr>
            <tr>
              <td><input type="text" value={this.state.other1} placeholder="e.g. languages" style={inputStyle} onChange={this.handleChange3} />{" "}:</td>
              <td><input type="text" value={this.state.other1value} placeholder="e.g. french" style={inputStyle} onChange={this.handleChange4} /></td>
            </tr>
            <tr>
              <td><input type="text" value={this.state.other2} placeholder="<fill in heading>" style={inputStyle} onChange={this.handleChange5} />{" "}:</td>
              <td><input type="text" value={this.state.other2value} placeholder="<fill in description>" style={inputStyle} onChange={this.handleChange6} /></td>
            </tr>
            <tr>
              <td><input type="text" value={this.state.other3} placeholder="<fill in heading>" style={inputStyle} onChange={this.handleChange7} />{" "}:</td>
              <td><input type="text" value={this.state.other3value} placeholder="<fill in description>" style={inputStyle} onChange={this.handleChange8} /></td>
            </tr>
          </table>
        </div>

        <br />
        <br />

        <Dropzone onDrop={this.onDrop} style={dzStyle}>
          <div>Simply drop or click to attach the Resumes here.</div>
        </Dropzone>
        
        {this.state.files.length > 0 ? 
        <div style={parentStyle}>
          <h2>{this.state.files.length} file(s):</h2>
          <div>{this.state.files.map((file) => <p key={file.name}>{file.name}</p> )}</div>
          <br />
          <UploadFiles files={this.state.files} jobTitle={this.state.jobTitle} skills={this.state.skills} other1={this.state.other1} other1value={this.state.other1value} other2={this.state.other2}
            other2value={this.state.other2value} other3={this.state.other3} other3value={this.state.other3value} />
        </div>
        : null}
      </div>
    )
  }
});

var UploadFiles = React.createClass({
  mixins: [ History ],

  onUpload: function(e) {
    e.preventDefault();
    console.log(this.props.files);
    var files = this.props.files;

    this.history.pushState(null, 'results');
    
    var req = superagent.post('http://localhost:5000/upload');

    req.field("title", this.props.jobTitle);
    req.field("skills", this.props.skills);
    req.field("other1", this.props.other1);
    req.field("other1value", this.props.other1value);
    req.field("other2", this.props.other2);
    req.field("other2value", this.props.other2value);
    req.field("other3", this.props.other3);
    req.field("other3value", this.props.other3value);

    files.forEach((file)=> {
        req.attach("files", file, file.name);
    });
    req.end(function(err, res){
      console.log("error posting resumes", err);
      console.log("success posting resumes", res);
    });
  },

  render: function() {
    var uploadBtnStyle = {
      color: "white",
      fontSize: 20,
      borderRadius: 5,
      borderColor: "#003d7c",
      background: "#003d7c",
      cursor: "pointer"
    };

    return (
      <form onSubmit={this.onUpload}>
        <input type="submit" value="Upload Files" style={uploadBtnStyle}/>
      </form>
    )
  }
});

var UploadBox = React.createClass({
  render: function() {
    var parentStyle = {
      textAlign: "center",
      fontFamily: "HelveticaNeue-Light"
    };

    var titleStyle = {
      color: "white",
      background: "#003d7c",
      fontSize: 50
    };

    return (
      <div style={parentStyle}>
        <div style={titleStyle}>CS3219 Project - CViA</div>
        <br />
        <Dz />
      </div>
    );
  }
});

var Results = React.createClass({
  getInitialState: function() {
    return {data: []};
  },

  componentDidMount: function() {
    // loading results from server for initialization
    this.loadResultsFromServer();
  },

  loadResultsFromServer: function() {
    superagent
    .get('http://localhost:5000/analyzer')
    .end(function(err, res){
      if (res) {
        console.log("res", res);
        this.setState({data: JSON.parse(res.text)});
      } else {
        console.log("error loading results from server: ", err);
      }
    }.bind(this));
  },

  render: function() {
    var titleStyle = {
      color: "white",
      background: "#003d7c",
      fontSize: 50,
      textAlign: "center",
      fontFamily: "HelveticaNeue-Light"
    };

    return (
      <div>
        <div style={titleStyle}>Results</div>
        <ResultList data={this.state.data} />
      </div>
    );
  }
});

var ResultList = React.createClass({
  render: function() {
    var conStyle = {
      textAlign: "center",
      paddingTop: 50
    };

    var titleStyle = {
      fontSize: 30,
      color: "#003d7c",
      fontFamily: "HelveticaNeue-Light"
    };

    var headStyle = {
      color: "#003d7c"
    };

    var resultNodes = this.props.data.map(function (result) {
      return (
        <Result name={result.Name}>
            {result.Score}
        </Result>
      );
    });
    
    return (
      <div style={conStyle}>
        <div style={titleStyle}>Name | Score</div>
        {resultNodes}
      </div>
    );
  }
});

var Result = React.createClass({
    render: function() {
      var rankStyle = {
        color: "white",
        fontFamily: "HelveticaNeue-Light",
        fontSize: 20
      };

      var scoreStyle  = {
        display: "inline-block"
      };

      // the marked library will take Markdown text and convert to raw HTML, sanitize: true tells marked to escape any HTML mark up instead of passing it through unchanged.
      var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
      
      return (
        <div style={rankStyle}>
            {this.props.name} | <span style={scoreStyle} dangerouslySetInnerHTML={{__html: rawMarkup}} />
        </div>
      );
    }
  });

React.render(
  (
    <Router>
      <Route path="/" component={UploadBox} />
      <Route path="results" component={Results} />
    </Router>
  )
  , document.getElementById('app')
);
