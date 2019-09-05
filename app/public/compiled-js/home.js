const e = React.createElement;

const AppNav = () => React.createElement("nav", {
  className: "navbar navbar-dark bg-dark"
}, React.createElement("a", {
  className: "navbar-brand",
  href: "#"
}, "Films"));

class FilmHelper extends React.Component {
  constructor(props) {
    super(props);
  }

  checkAllFields(film) {
    if (!this._input_name.value) {
      this.props.onMessage('Fill the name.');
      return false;
    }

    if (!this._input_realized_at.value) {
      this.props.onMessage('Fill the realized_at field.');
      return false;
    }

    if (isNaN(parseInt(this._input_realized_at.value))) {
      this.props.onMessage('Realized at field must be a year number.');
      return false;
    }

    if (!this._input_format.value) {
      this.props.onMessage('Fill the format field.');
      return false;
    }

    if (!this._input_actors.value) {
      this.props.onMessage('Fill the actors field.');
      return false;
    }

    this.props.onMessage('');
    return true;
  }

}

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      films: [],
      selected_film: null,
      query: '',
      queryTarget: 'name'
    };
    this.handleMassage = this.handleMassage.bind(this);
    this.handleAddedFilm = this.handleAddedFilm.bind(this);
    this.handleSelectFilm = this.handleSelectFilm.bind(this);
    this.handleUpdatedFilm = this.handleUpdatedFilm.bind(this);
    this.handleFilter = this.handleFilter.bind(this);
    this.refresh();
  }

  handleMassage(msg) {
    if (msg) {
      this._warn_el.innerText = msg;
      this._warn_el.parentNode.style.visibility = 'visible';
    } else {
      this._warn_el.innerText = '';
      this._warn_el.parentNode.style.visibility = 'hidden';
    }
  }

  handleAddedFilm() {
    this.refresh();
  }

  handleUpdatedFilm() {
    this.refresh();
  }

  handleSelectFilm(film) {
    this.setState({
      selected_film: film
    });
  }

  handleFilter(query, queryTarget) {
    console.log('handleFilter');
    this.refresh(query, queryTarget);
  }

  refresh(query, queryTarget) {
    console.log('refresh');
    var self = this;
    var data = {};

    if (query) {
      data.query = query;
      data.queryTarget = queryTarget;
    }

    $.ajax({
      method: 'GET',
      type: 'GET',
      url: '/films',
      data: data
    }).then(function (result, textStatus, jqXHR) {
      if (result.status === 'success') {
        return result.data;
      } else {
        throw new Error(result.message);
      }
    }).then(function (films) {
      self.setState({
        films: films,
        selected_film: films.find(function (film) {
          return self.state.selected_film && film.id === self.state.selected_film.id;
        }),
        query: query,
        queryTarget: queryTarget
      });
    }, function (err) {
      console.log('error');
      self.props.onMessage(err.message);
      console.log(err.message);
    });
  }

  render() {
    return React.createElement("div", {
      className: "container"
    }, React.createElement("div", {
      className: "row"
    }, React.createElement("div", {
      className: "alert alert-warning",
      style: {
        width: '100%',
        display: 'inline-block',
        visibility: 'hidden'
      }
    }, React.createElement("div", {
      style: {
        display: 'inline-block'
      },
      ref: el => this._warn_el = el
    }), "\xA0")), React.createElement("div", {
      className: "row"
    }, React.createElement("div", {
      className: "col",
      style: {
        width: '18rem',
        display: 'inline-block'
      }
    }, React.createElement(FilmInfo, {
      onMessage: this.handleMassage,
      onUpdatedFilm: this.handleUpdatedFilm,
      film: this.state.selected_film
    })), React.createElement("div", {
      className: "col",
      style: {
        display: 'inline-block',
        'minWidth': '30rem'
      }
    }, React.createElement(TableFilms, {
      onMessage: this.handleMassage,
      query: this.state.query,
      queryTarget: this.state.queryTarget,
      onFilter: this.handleFilter,
      onSelectFilm: this.handleSelectFilm,
      selected_film: this.state.selected_film,
      films: this.state.films
    })), React.createElement("div", {
      className: "col",
      style: {
        width: '18rem',
        display: 'inline-block'
      }
    }, React.createElement(FilmLoader, {
      onMessage: this.handleMassage,
      onAddedFilm: this.handleAddedFilm
    }))));
  }

}

class FilmInfo extends FilmHelper {
  constructor(props) {
    super(props);
    console.log('hello');
    this.state = {
      changable: false,
      film: null
    };
  }

  handleChangeButtonClick() {
    console.log('here 2');
    this.setState({
      changable: true,
      film: _.clone(this.props.film)
    });
  }

  handleSaveButtonClick() {
    console.log('here 2');
    this.setState({
      changable: false
    });
    if (!this.checkAllFields()) return;
    var self = this;
    var data = {
      name: this._input_name.value,
      realized_at: this._input_realized_at.value,
      format: this._input_format.value,
      actors: this._input_actors.value
    };
    $.ajax({
      method: 'PUT',
      type: 'PUT',
      url: '/films/' + this.props.film.id,
      data: data
    }).then(function (result, textStatus, jqXHR) {
      if (result.status === 'success') {
        return result.data;
      } else {
        throw new Error(result.message);
      }
    }).then(function (data) {
      console.log(data);
      self.setState({
        changable: false
      });
      self.props.onUpdatedFilm();
    }, function (err) {
      console.log('error');
      self.props.onMessage(err.message);
      console.log(err.message);
    });
  }

  handleDeleteButtonClick() {
    var self = this;
    $.ajax({
      method: 'DELETE',
      type: 'DELETE',
      url: '/films/' + this.props.film.id
    }).then(function (result, textStatus, jqXHR) {
      if (result.status === 'success') {
        return result.data;
      } else {
        throw new Error(result.message);
      }
    }).then(function (data) {
      console.log(data);
      self.setState({
        changable: false
      });
      self.props.onUpdatedFilm();
    }, function (err) {
      console.log('error');
      self.props.onMessage(err.message);
      console.log(err.message);
    });
  }

  render() {
    if (this.state.film) {
      if (!this.props.film || this.props.film.id !== this.state.film.id) {
        this.setState({
          film: this.props.film,
          changable: false
        });
      }
    }

    if (this.state.changable) {
      return React.createElement("div", {
        className: "card",
        style: {
          visibility: this.state.film ? 'inherit' : 'hidden',
          width: '18rem'
        }
      }, React.createElement("div", {
        className: "card-body"
      }, React.createElement("h5", {
        className: ""
      }, "Add a new:"), React.createElement("h6", {
        className: ""
      }, "Name:"), React.createElement("input", {
        name: "name",
        type: "text",
        onChange: () => {
          var film = this.state.film;
          film.name = this._input_name.value;
          this.setState({
            film: film
          });
        },
        ref: el => {
          this._input_name = el;
        },
        value: this.state.film ? this.state.film.name : ''
      }), React.createElement("h6", {
        className: ""
      }, "Realized at:"), React.createElement("input", {
        name: "realized_at",
        type: "text",
        onChange: () => {
          var film = this.state.film;
          film.realized_at = this._input_realized_at.value;
          this.setState({
            film: film
          });
        },
        ref: el => {
          this._input_realized_at = el;
        },
        value: this.state.film ? this.state.film.realized_at : '',
        placeholder: "Year"
      }), React.createElement("h6", {
        className: ""
      }, "Format:"), React.createElement("input", {
        name: "format",
        type: "text",
        onChange: () => {
          var film = this.state.film;
          film.format = this._input_format.value;
          this.setState({
            film: film
          });
        },
        ref: el => {
          this._input_format = el;
        },
        value: this.state.film ? this.state.film.format : ''
      }), React.createElement("h6", {
        className: ""
      }, "Actors"), React.createElement("textarea", {
        name: "actors",
        onChange: () => {
          var film = this.state.film;
          film.actors = this._input_actors.value;
          this.setState({
            film: film
          });
        },
        ref: el => {
          this._input_actors = el;
        },
        value: this.state.film ? this.state.film.actors : '',
        type: "textarea",
        placeholder: "Actors"
      }), React.createElement("button", {
        className: "",
        onClick: () => this.handleSaveButtonClick()
      }, "save")));
    } else {
      return React.createElement("div", {
        className: "card",
        style: {
          visibility: this.props.film ? 'inherit' : 'hidden',
          width: '18rem'
        }
      }, React.createElement("div", {
        className: "card-body"
      }, React.createElement("h5", {
        className: ""
      }, "Film info"), React.createElement("h5", {
        className: ""
      }, this.props.film ? this.props.film.name : ''), React.createElement("h6", {
        className: ""
      }, "Realized at:"), React.createElement("p", {
        className: ""
      }, this.props.film ? this.props.film.realized_at : ''), React.createElement("h6", {
        className: ""
      }, "Format:"), React.createElement("p", {
        className: ""
      }, this.props.film ? this.props.film.format : ''), React.createElement("h6", {
        className: ""
      }, "Actors"), React.createElement("p", {
        className: ""
      }, this.props.film ? this.props.film.actors.join(', ') : ''), React.createElement("button", {
        className: "card-link",
        onClick: () => this.handleChangeButtonClick()
      }, "change"), React.createElement("button", {
        onClick: () => this.handleDeleteButtonClick(),
        className: "card-link"
      }, "delete")));
    }
  }

}

class TableFilms extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleSelectFilm(film) {
    if (this.props.selected_film && this.props.selected_film.id === film.id) {
      console.log('here1');
      this.props.onSelectFilm(null);
    } else {
      console.log('here2');
      this.props.onSelectFilm(film);
    }
  }

  handleChange() {
    console.log('handleChange');
    this.props.onFilter(this._input_query.value.trim(), this._select_query_target.value.trim());
  }

  render() {
    const films = this.props.films.map((film, step) => {
      return React.createElement("div", {
        style: {
          width: '100%'
        },
        key: film.id
      }, React.createElement("button", {
        className: ["btn", this.props.selected_film && film.id === this.props.selected_film.id ? 'btn-default' : 'btn-link'].join(' '),
        style: {
          'whiteSpace': 'normal',
          'wordWrap': 'normal',
          width: '100%'
        },
        onClick: () => this.handleSelectFilm(film, step)
      }, film.name, "(", film.realized_at, ")"));
    });
    return React.createElement("div", {
      className: "card"
    }, React.createElement("div", {
      className: "card-body"
    }, React.createElement("h5", {
      className: ""
    }, "Film table"), React.createElement("input", {
      type: "text",
      onChange: this.handleChange,
      ref: el => this._input_query = el,
      defaultValue: this.props.query
    }), React.createElement("select", {
      name: "where",
      onChange: this.handleChange,
      ref: el => this._select_query_target = el,
      defaultValue: this.props.queryTarget
    }, React.createElement("option", {
      value: "name"
    }, "name"), React.createElement("option", {
      value: "actors"
    }, "actors")), React.createElement("div", null, films)));
  }

}

class FilmLoader extends FilmHelper {
  constructor(props) {
    super(props);
  }

  checkAllFields(film) {
    if (!this._input_name.value) {
      this.props.onMessage('Fill the name.');
      return false;
    }

    if (!this._input_realized_at.value) {
      this.props.onMessage('Fill the realized_at field.');
      return false;
    }

    if (isNaN(parseInt(this._input_realized_at.value))) {
      this.props.onMessage('Realized at field must be a year number.');
      return false;
    }

    if (!this._input_format.value) {
      this.props.onMessage('Fill the format field.');
      return false;
    }

    if (!this._input_actors.value) {
      this.props.onMessage('Fill the actors field.');
      return false;
    }

    this.props.onMessage('');
    return true;
  }

  handleSendManualForm() {
    if (!this.checkAllFields()) return;
    var self = this;
    var data = {
      name: this._input_name.value,
      realized_at: this._input_realized_at.value,
      format: this._input_format.value,
      actors: this._input_actors.value
    };
    $.ajax({
      method: 'POST',
      type: 'POST',
      url: '/films',
      data: data
    }).then(function (result, textStatus, jqXHR) {
      if (result.status === 'success') {
        return result.data;
      } else {
        throw new Error(result.message);
      }
    }).then(function (data) {
      console.log(data);
      self._input_name.value = '';
      self._input_realized_at.value = '';
      self._input_format.value = '';
      self._input_actors.value = '';
      self.props.onAddedFilm();
    }, function (err) {
      console.log('error');
      self.props.onMessage(err.message);
      console.log(err.message);
    });
    return false;
  }

  handleSendFileForm() {
    console.log('here 1');
    var self = this;

    if (!this._input_file.value) {
      this.props.onMessage('Choose the file.');
      return false;
    }

    if (!/\.txt$/.test(this._input_file.value)) {
      this.props.onMessage('Choose a txt-file.');
      return false;
    }

    self.props.onMessage('');
    var formData = new FormData();
    formData.append('films', this._input_file.files[0]);
    $.ajax({
      method: 'POST',
      type: 'POST',
      url: '/films',
      data: formData,
      cache: false,
      contentType: false,
      processData: false
    }).then(function (result, textStatus, jqXHR) {
      console.log('here 3');

      if (result.status === 'success') {
        return result.data;
      } else {
        throw new Error(result.message);
      }
    }).then(function (data) {
      console.log('here 4');
      console.log(data);
      self._input_file.value = '';
      self.props.onAddedFilm();
    }, function (err) {
      console.log('here 5');
      console.log('error');
      self.props.onMessage(err.message);
      console.log(err.message);
    });
  }

  render() {
    return React.createElement("div", {
      className: "card",
      style: {
        width: '18rem'
      }
    }, React.createElement("div", {
      className: "card-body"
    }, React.createElement("h5", {
      className: ""
    }, "Add a new:"), React.createElement("h6", {
      className: ""
    }, "Name:"), React.createElement("input", {
      name: "name",
      type: "text",
      ref: el => {
        this._input_name = el;
      }
    }), React.createElement("h6", {
      className: ""
    }, "Realized at:"), React.createElement("input", {
      name: "realized_at",
      type: "text",
      ref: el => {
        this._input_realized_at = el;
      },
      placeholder: "Year"
    }), React.createElement("h6", {
      className: ""
    }, "Format:"), React.createElement("input", {
      name: "format",
      type: "text",
      ref: el => {
        this._input_format = el;
      }
    }), React.createElement("h6", {
      className: ""
    }, "Actors"), React.createElement("textarea", {
      name: "actors",
      ref: el => {
        this._input_actors = el;
      },
      type: "textarea",
      placeholder: "Actors"
    }), React.createElement("button", {
      className: "",
      onClick: () => this.handleSendManualForm()
    }, "save"), React.createElement("h5", {
      className: "card-title"
    }, "Load a file:"), React.createElement("input", {
      type: "file",
      name: "films",
      ref: el => {
        this._input_file = el;
      }
    }), React.createElement("button", {
      className: "",
      onClick: () => this.handleSendFileForm()
    }, "Send")));
  }

}

const domContainer = document.querySelector('#root');
ReactDOM.render(e(Home), domContainer);