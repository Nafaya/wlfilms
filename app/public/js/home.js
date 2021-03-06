const e = React.createElement;

const AppNav = () => (
   <nav className="navbar navbar-dark bg-dark">
       <a className="navbar-brand" href="#">Films</a>
   </nav>
);

function ApiAjax(obj){
    return $.ajax(obj).then(function( result, textStatus, jqXHR ) {
        if(!result) throw new Error('Bad response.') ;
        if(result.status==='success') return result.data ;
        if(!result.message) throw new Error('Bad response.') ;
        throw new Error(result.message) ;
    },function( jqXHR, textStatus, errorThrown  ) {
        if(!jqXHR.responseJSON) throw new Error('Bad response.') ;
        var result = jqXHR.responseJSON ;
        if(!result.message) throw new Error('Bad response.') ;
        throw new Error(result.message) ;
    })
}
class FilmHelper extends React.Component{
    constructor(props) {
        super(props);
    }
    checkAllFields(film){
        if(!this._input_name.value){
            this.props.onMessage('Fill the name.') ;
            return false ;
        }
        if(!this._input_realized_at.value){
            this.props.onMessage('Fill the realized_at field.') ;
            return false ;
        }
        let year = parseInt(this._input_realized_at.value) ;
        if(isNaN(year)){
            this.props.onMessage('Realized at field must be a year number.') ;
            return false ;
        }
        let currentYear = (new Date()).getFullYear()+1 ;
        if(year<1850||year>currentYear){
            this.props.onMessage('Realized at field must be between 1850 and '+currentYear+'.') ;
            return false ;
        }
        if(!this._input_format.value){
            this.props.onMessage('Fill the format field.') ;
            return false ;
        }
        if(!this._input_actors.value){
            this.props.onMessage('Fill the actors field.') ;
            return false ;
        }
        this.props.onMessage('') ;
        return true ;
    }
}
class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            films:[],
            selected_film:null,
            query:'',
            queryTarget:'name'
        } ;
        this.handleMassage = this.handleMassage.bind(this) ;
        this.handleAddedFilm = this.handleAddedFilm.bind(this) ;
        this.handleSelectFilm = this.handleSelectFilm.bind(this) ;
        this.handleUpdatedFilm = this.handleUpdatedFilm.bind(this) ;
        this.handleFilter = this.handleFilter.bind(this) ;
        this.refresh() ;
    }
    handleMassage(msg){
        if(msg){
            this._warn_el.innerText = msg ;
            this._warn_el.parentNode.style.visibility = 'visible' ;
        }else{
            this._warn_el.innerText = '' ;
            this._warn_el.parentNode.style.visibility = 'hidden' ;
        }
    }
    handleAddedFilm(){
        this.refresh() ;
    }
    handleUpdatedFilm(){
        this.refresh() ;
    }
    handleSelectFilm(film){
        this.setState({selected_film:film})
    }
    handleFilter(query, queryTarget){
        console.log('handleFilter') ;
        this.refresh(query,queryTarget) ;
    }
    refresh(query, queryTarget){
        console.log('refresh') ;
        var self = this ;
        var data = {} ;
        if(query){
            data.query = query;
            data.queryTarget = queryTarget ;
        }
        ApiAjax({
            method: 'GET',
            type: 'GET',
            url: '/films',
            data:data
        }).then(function( films ) {
            self.setState({films:films,selected_film:films.find(function(film){return self.state.selected_film && film.id===self.state.selected_film.id}),query:query,queryTarget:queryTarget   })
        }, function (err) {
            console.log('error') ;
            self.props.onMessage(err.message) ;
            console.log(err.message) ;
        });
    }
    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="alert alert-warning" style={{width:'100%', display:'inline-block', visibility:'hidden'}}><div style={{display:'inline-block'}} ref={(el)=>this._warn_el=el}></div>&#160;</div>
                </div>
                <div className="row">
                    <div className="col" style={{width:'18rem', display:'inline-block'}}><FilmInfo onMessage={this.handleMassage} onUpdatedFilm={this.handleUpdatedFilm} film={this.state.selected_film} /></div>
                    <div className="col" style={{display:'inline-block','minWidth':'30rem'}}><TableFilms onMessage={this.handleMassage} query={this.state.query} queryTarget={this.state.queryTarget} onFilter={this.handleFilter} onSelectFilm={this.handleSelectFilm} selected_film={this.state.selected_film} films={this.state.films}/></div>
                    <div className="col" style={{width:'18rem', display:'inline-block'}}><FilmLoader onMessage={this.handleMassage} onAddedFilm={this.handleAddedFilm} /></div>
                </div>
            </div>
        );
    }
}
class FilmInfo extends FilmHelper {
    constructor(props) {
        super(props);
        console.log('hello') ;
        this.state = {
            changable:false,
            film:null
        }
    }
    handleChangeButtonClick(){
        console.log('here 2') ;
        this.setState({changable:true,film:_.clone(this.props.film)})

    }
    handleSaveButtonClick(){
        console.log('here 2') ;
        this.setState({changable:false})
        if(!this.checkAllFields()) return ;
        var self =  this ;
        var data = {
            name:this._input_name.value,
            realized_at:this._input_realized_at.value,
            format:this._input_format.value,
            actors:this._input_actors.value,
        } ;
        ApiAjax({
            method: 'PUT',
            type: 'PUT',
            url: '/films/'+this.props.film.id,
            data: data
        }).then(function( data ) {
            console.log(data) ;
            self.setState({changable:false})
            self.props.onUpdatedFilm() ;
        }, function (err) {
            console.log('error') ;
            self.props.onMessage(err.message) ;
            console.log(err.message) ;
        });

    }
    handleDeleteButtonClick(){
        var self =  this ;
        ApiAjax({
            method: 'DELETE',
            type: 'DELETE',
            url: '/films/'+this.props.film.id
        }).then(function( data ) {
            console.log(data) ;
            self.setState({changable:false})
            self.props.onUpdatedFilm() ;
        }, function (err) {
            console.log('error') ;
            self.props.onMessage(err.message) ;
            console.log(err.message) ;
        }).then(()=>{
            $(this._delete_modal).modal('hide') ;
        })
    }
    render() {
        if(this.state.film){
            if(!this.props.film || this.props.film.id!==this.state.film.id) {
                this.setState({film: this.props.film, changable: false});
            }
        }
        if(this.state.changable){
            return (
                <div className="card" style={{visibility:(this.state.film)?'inherit':'hidden',width:'18rem'}}>
                    <div className="card-body">
                        <h5 className="">Add a new:</h5>
                        <h6 className="">Name:</h6>
                        <input className="form-control" name="name" type="text" onChange={()=>{var film = this.state.film;film.name = this._input_name.value;this.setState({film:film})}} ref={(el)=>{this._input_name=el;}} value={(this.state.film)?this.state.film.name:''} />
                        <h6 className="">Realized at:</h6>
                        <input className="form-control" name="realized_at" type="text" onChange={()=>{var film = this.state.film;film.realized_at = this._input_realized_at.value;this.setState({film:film})}} ref={(el)=>{this._input_realized_at=el;}} value={(this.state.film)?this.state.film.realized_at:''} placeholder="Year"/>
                        <h6 className="">Format:</h6>
                        <select name="format" className="form-control" onChange={()=>{var film = this.state.film;film.format = this._input_format.value;this.setState({film:film})}} ref={(el)=>{this._input_format=el;}} value={(this.state.film)?this.state.film.format:''}>
                            <option value="DVD">DVD</option>
                            <option value="Blu-Ray">Blu-Ray</option>
                            <option value="VHS">VHS</option>
                        </select>
                        <h6 className="">Actors</h6>
                        <textarea className="form-control" name="actors" onChange={()=>{var film = this.state.film;film.actors = this._input_actors.value;this.setState({film:film})}} ref={(el)=>{this._input_actors=el;}} value={(this.state.film)?this.state.film.actors:''} type="textarea" placeholder="Actors" />


                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={()=>this.handleSaveButtonClick()}>save</button>
                            <button className="btn btn-secondary" onClick={()=>$(this._delete_modal).modal('show')}>delete</button>
                        </div>
                    </div>
                </div>
            );
        }else{
            return (
                <div className="card" style={{visibility:(this.props.film)?'inherit':'hidden',width:'18rem'}}>
                    <div className="card-body">
                        <h5 className="">Film info</h5>
                        <h5 className="">{(this.props.film)?this.props.film.name:''}</h5>
                        <h6 className="">Realized at:</h6>
                        <p className="">{(this.props.film)?this.props.film.realized_at:''}</p>
                        <h6 className="">Format:</h6>
                        <p className="">{(this.props.film)?this.props.film.format:''}</p>
                        <h6 className="">Actors</h6>
                        <p className="">{(this.props.film)?this.props.film.actors.join(', '):''}</p>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={()=>this.handleChangeButtonClick()}>change</button>
                            <button className="btn btn-secondary" onClick={()=>$(this._delete_modal).modal('show')}>delete</button>
                        </div>
                    </div>
                    <div className="modal fade" ref={(el)=>{this._delete_modal=el;}} tabIndex="-1" role="dialog" aria-hidden="true">
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Delete film {(this.props.film)?(this.props.film.name+'('+this.props.film.realized_at+')'):''}.</h5>
                                </div>
                                <div className="modal-body">
                                    Are you sure?
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                    <button type="button" className="btn btn-primary" onClick={()=>this.handleDeleteButtonClick()}>Delete</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }
}
class TableFilms extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this) ;
    }
    handleSelectFilm(film){
        if(this.props.selected_film && this.props.selected_film.id===film.id){
            console.log('here1') ;
            this.props.onSelectFilm(null) ;
        }else{
            console.log('here2')
            this.props.onSelectFilm(film) ;
        }
    }
    handleChange(){
        console.log('handleChange') ;
        this.props.onFilter(this._input_query.value.trim(),this._select_query_target.value.trim()) ;
    }
    render() {
        const films = this.props.films.map((film,step   ) => {
            return (
                <div style={{width:'100%'}} key={film.id}>
                    <button className={["btn",(this.props.selected_film && film.id===this.props.selected_film.id)?'btn-default':'btn-link'].join(' ')} style={{'whiteSpace': 'normal','wordWrap': 'normal',width:'100%'}} onClick={() => this.handleSelectFilm(film,step)}>{film.name}({film.realized_at})</button>
                </div>
            );
        });
        var no_films = (
            <div class="text-center"><h6>No such films.</h6></div>
        ) ;
        return (
            <div className="card">
                <div className="card-body">
                    <h5 className="">Film table</h5>
                    <div className="input-group">
                        <input className="form-control" style={{width:'max-content'}} type="text" onChange={this.handleChange} ref={(el)=>this._input_query=el} placeholder={(this._select_query_target && this._select_query_target.value)||'name'} defaultValue={this.props.query}/>
                        <select className="custom-select" name="where" onChange={this.handleChange} ref={(el)=>this._select_query_target=el} defaultValue={this.props.queryTarget}>
                            <option value="name">name</option>
                            <option value="actors">actors</option>
                        </select>
                    </div>
                    <div>{(this.props.films.length)?films:no_films}</div>
                </div>
            </div>
        );
    }
}
class FilmLoader extends FilmHelper{
    constructor(props) {
        super(props);
    }
    handleSendManualForm(){
        if(!this.checkAllFields()) return ;
        var self =  this ;
        var data = {
            name:this._input_name.value,
            realized_at:this._input_realized_at.value,
            format:this._input_format.value,
            actors:this._input_actors.value,
        } ;
        ApiAjax({
            method: 'POST',
            type: 'POST',
            url: '/films',
            data: data
        }).then(function( data ) {
            console.log(data) ;
            self._input_name.value = '' ;
            self._input_realized_at.value = '' ;
            self._input_format.value = '' ;
            self._input_actors.value = '' ;
            self.props.onAddedFilm() ;
        }, function (err) {
            self.props.onMessage(err.message) ;
            console.log(err.message) ;
        });
        return false ;
    }
    handleSendFileForm(){
        console.log('here 1') ;
        var self = this ;
        if(!this._input_file.value){
            this.props.onMessage('Choose the file.') ;
            return false ;
        }
        if(!/\.txt$/.test(this._input_file.value)){
            this.props.onMessage('Choose a txt-file.') ;
            return false ;
        }
        self.props.onMessage('') ;
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
        }).then(function( result, textStatus, jqXHR ) {
            console.log('here 3') ;
            if(result.status==='success'){
                return result.data ;
            } else {
                throw new Error(result.message) ;
            }
        }).then(function( data ) {
            console.log('here 4') ;
            console.log(data) ;
            self._input_file.value = '' ;
            self.props.onAddedFilm() ;
        }, function (err) {
            console.log('here 5') ;
            console.log('error') ;
            self.props.onMessage(err.message) ;
            console.log(err.message) ;
        });
    }
    render() {
        return (
            <div className="card" style={{width:'18rem'}}>
                <div className="card-body">
                    <h5 className="">Add a new:</h5>
                    <h6 className="">Name:</h6>
                    <input className="form-control" name="name" type="text" placeholder="Name" ref={(el)=>{this._input_name=el;}} />
                    <h6 className="">Realized at:</h6>
                    <input className="form-control" name="realized_at" type="text" ref={(el)=>{this._input_realized_at=el;}} placeholder="Year"/>
                    <h6 className="">Format:</h6>
                    <select name="format" className="form-control" ref={(el)=>{this._input_format=el;}}>
                        <option value="DVD">DVD</option>
                        <option value="Blu-Ray">Blu-Ray</option>
                        <option value="VHS">VHS</option>
                    </select>
                    <h6 className="">Actors</h6>
                    <textarea className="form-control" name="actors" ref={(el)=>{this._input_actors=el;}} type="textarea" placeholder="Actors"></textarea>
                    <br />
                    <button className="btn btn-secondary" onClick={()=>this.handleSendManualForm()}>save</button><br /><br />
                    <h5 className="card-title">Load a file:</h5>
                    <input type="file" className="form-control"  name="films" ref={(el)=>{this._input_file=el;}} />
                    <button className="btn btn-secondary" onClick={()=>this.handleSendFileForm()}>Send</button>
                </div>
            </div>
        );
    }
}
const domContainer = document.querySelector('#root');
ReactDOM.render(e(Home), domContainer);