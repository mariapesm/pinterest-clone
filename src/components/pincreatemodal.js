"use strict" //displays modal that creates pin
import React, { Component } from 'react';
import { Button,Modal} from 'react-bootstrap'
import {findDOMNode} from 'react-dom';
import Masonry from 'react-masonry-component';

class PinCreate extends Component {
  constructor(props) {
    super(props)
    //initialize modal show state to false
    this.state={
      show:false,
      picPreview:'/images/NO-IMAGE.png',//on erroneous image links
      saveDisabled:true,//parameter controls save button state
      picValid:false,//erroneous image flag
      descriptionValid:false//no description flag
    }
  }

  componentDidUpdate(prevProps, prevState) {//compare previous props to current efore showing
    if((prevProps.message===false)&&(this.props.message===true)){
      this.setState({
        show:true
      })
    }
  }
  open(){
  this.setState({
    show:true
  })
  }
  close(){
    //note my modified modal now sends a reset callback after closing modalstate which clears
    //the message field, not also to reset pic url to erroneous image png before exit
    this.setState({
      show: false,
      picPreview:'/images/NO-IMAGE.png'
    },()=>this.props.reset());
  }

  picprocess(e){//processes picture on change of text box
    let imglinkHttps = e.target.value
    //convert to https to avoid mixed content warning in console
    if(e.target.value.split(":")[0]==="http"){
      imglinkHttps = e.target.value.split(":")[0]+"s:"+e.target.value.split(":")[1]
    }
    if (this.state.descriptionValid){//check also if a description has been entered
      this.setState({
        picPreview:imglinkHttps,//set attempting pic url
        picValid:true,//if on error has not fired must be ok
        saveDisabled:false//can proceed to saving as we have a description and valid pic
      })
    }
    else{//no description
      this.setState({
        picPreview:imglinkHttps,//set attempting pic url
        picValid:true,//if on error has not fired must be ok
        saveDisabled:true//can not vaidate save button as there is no description
      })
    }
  }
  discprocess(e){//processes description entered for new pin
    if(e.target.value.length){//check if something is entered
      if(this.state.picValid){//check also if there is no error / broken image
        this.setState({
          descriptionValid:true,
          saveDisabled:false//ready to save
        })
      }
      else{
        this.setState({
          descriptionValid:true,
          saveDisabled:true//broken image can not save even if we have a description
        })
      }

    }
    else{//no description can not save anything
      this.setState({
        descriptionValid:false,
        saveDisabled:true
      })
    }
  }
  invalidImage(){//error handler for invalid/broken pic routes can not save in this state
    this.setState({
      picPreview:'/images/NO-IMAGE.png',
      picValid:false,
      saveDisabled:true
    })
  }
  savePic(){//ready to save pin
    let picDescription = findDOMNode(this.refs.imgdesc).value.trim()
    //prepare JSON for POST api
    let pinJSON={
      owner:this.props.userInfo.username,
      imgDescription:picDescription,
      imgLink:this.state.picPreview,
      timeStamp:Date.now(),
      savedBy: []
    }
    //save into db and close modal
    this.props.savePin(pinJSON)
    this.close()
  }
  addpin(){//body of modal
    return(
      <div id="addpin">
        <div id="picdisplay">
          <Masonry>
            <img  onError={()=>this.invalidImage()} className="pinTest" src={this.state.picPreview}/>
          </Masonry>
        </div>
        <div id="formarea">
          <p>Add a description</p>
          <textarea
          ref="imgdesc"
          id="textdesc"
          placeholder="Description..."
          maxLength="28"
          onChange={(e)=>this.discprocess(e)}
           />
           <p>Paste Link to Image</p>
           <textarea
           ref="imglink"
           id="textlink"
           placeholder="http://"
           onChange={(e)=>this.picprocess(e)}
            />

        </div>
      </div>
      )
  }
  render() {
    return (
      <Modal
        show={this.state.show}
        onHide={this.close.bind(this)}
        container={this}
        aria-labelledby="contained-modal-title"
      >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title">Create Pin</Modal.Title>
      </Modal.Header>
      <Modal.Body>
          {this.addpin()}
      </Modal.Body>
      <Modal.Footer>
        <Button bsStyle="danger" onClick={()=>this.savePic()} disabled={this.state.saveDisabled}>Save</Button>
      </Modal.Footer>
    </Modal>
    );
  }

}

export default PinCreate;
