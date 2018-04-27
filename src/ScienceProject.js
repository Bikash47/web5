import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TextInput, Image,
    StatusBar

} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import {connect} from 'react-redux';
import {dataObj} from "./actions/Web5Action";

var base64 = require('base-64');
import fetch_blob from 'react-native-fetch-blob';
import RNFS from 'react-native-fs';
import ImageViewer from 'react-native-image-zoom-viewer';
import Modal from "react-native-modal";

window.DOMParser = require('xmldom').DOMParser;
var soap = require('soap-everywhere');
const XMLSerializer = require('xmldom').XMLSerializer;
var decodedImage;

var badCell = null;
var goodCell = null;
var image = null;
var remark = null;

var ss;

// Add you system IP Address here
let url = "http://192.168.1.62:8080/ImageService/ImageUploadService?wsdl";

class ScienceProject extends Component {
    constructor(props) {
        super(props);

        this.state = {
            // visible: false,
            ImageIn_base64: [],
            imageSource: null,
            isModalVisible: false,
            imgCode:"",

            test: ''

        };
    }

    appendChild(xmlDoc, parentElement, name, text) {
        let childElement = xmlDoc.createElement(name);
        if (typeof text !== 'undefined') {
            let textNode = xmlDoc.createTextNode(text);
            childElement.appendChild(textNode);
        }
        parentElement.appendChild(childElement);
        return childElement;
    }

    exportToXmlDoc(myPlan) {
        debugger;
        // documentElement always represents the root node
        const xmlDoc = new DOMParser().parseFromString("<soap:Envelope xmlns:soap=\"http://www.w3.org/2003/05/soap-envelope\" xmlns:web=\"http://webservice.bipros.com/\"></soap:Envelope>");
        const rootElement = xmlDoc.documentElement;
        const folderElement = this.appendChild(xmlDoc, rootElement, 'soap:Body');
        const imageElement = this.appendChild(xmlDoc, folderElement, 'web:processImage');
        this.appendChild(xmlDoc, imageElement, 'ImageInByte', myPlan);
        // const planElement = appendChild(xmlDoc, folderElement, 'plan');
        // appendChild(xmlDoc, planElement, 'name', 'Eddie');

        const xmlSerializer = new XMLSerializer();
        const xmlOutput = xmlSerializer.serializeToString(xmlDoc);

        console.log("xmlOutput:", xmlOutput);

        return xmlOutput;
    }

    _toggleModal = () =>
        this.setState({isModalVisible: !this.state.isModalVisible});

    async soap(tt) {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open('POST', url, true);
        debugger;
        // build SOAP request

        xmlhttp.onreadystatechange = await function () {
            if (xmlhttp.readyState == 4) {
                if (xmlhttp.status == 200) {
                    debugger;
                    var resTxt = xmlhttp.responseText;
                    var parser = new DOMParser();
                    var xmlDoc = parser.parseFromString(resTxt, "text/xml");
                    var goodCells = xmlDoc.getElementsByTagName("goodCells")[0].childNodes[0].nodeValue;
                    var badCells = xmlDoc.getElementsByTagName("badCells")[0].childNodes[0].nodeValue;
                    var imageInByte = xmlDoc.getElementsByTagName("imageInByte")[0].childNodes[0].nodeValue;
                    var remarks = xmlDoc.getElementsByTagName("remarks")[0].childNodes[0].nodeValue;
                    var obj = {
                        goodCell: goodCells,
                        badCell: badCells,
                        image: imageInByte,
                        remark: remarks
                    };
                    ss.dataObj(obj);
                    decodedImage = imageInByte;
                    debugger;
                    let partFile = "data:image/png;base64,";
                    var imageFile = partFile + decodedImage
                    debugger;

                    const fs = fetch_blob.fs
                    const dirs = fetch_blob.fs.dirs
                    const file_path = dirs.DCIMDir + "/bigjpg1.png"
                    debugger;
                    //   var image_data = json.qr.split('data:image/png;base64,');
                    //   image_data = image_data[1];
                    RNFS.writeFile(file_path, decodedImage, 'base64')
                        .catch((error) => {
                            alert("ERROR:::::" + error);
                        });
                    /*

                                        this.setState({
                                            goodCell: goodCells,
                                            badCell:badCells,
                                            image:imageInByte,
                                            remark:remarks
                                        });
                    */

                    debugger;
                }
            }

        }
        // Send the POST request
        xmlhttp.setRequestHeader('Content-Type', 'application/soap+xml');
        xmlhttp.send(tt);
        //  xmlhttp.send(require("./xmlBody.xml"));
        debugger
        // send request
        // ...
    }

    renderModal() {
        const fs = fetch_blob.fs
        const dirs = fetch_blob.fs.dirs
        const file_path = dirs.DCIMDir + "/bigjpg1.png"

        var image_path = 'file:///' + file_path
        const images = [{
            url: image_path,

        }]
        return (
            <Modal isVisible={this.state.isModalVisible}
                   onBackdropPress={() => this.setState({isModalVisible: false})}
                   animationIn='slideInUp'
                   animationOut='slideOutDown'
            >
                <View style={{flex: 0.05, backgroundColor: 'black', alignItems: 'flex-end'}}>
                    <TouchableOpacity onPress={this._toggleModal}>
                        <Image style={{height: 20, width: 20}}
                               source={require('./Image/cross.png')}
                        />
                    </TouchableOpacity>
                </View>
                <View style={{flex: 1}}>

                    <ImageViewer imageUrls={images}/>

                </View>
            </Modal>
        )
    }


    func_submitButtonClick() {
        var tt = this.exportToXmlDoc(this.state.imgCode);
        ss = this.props;
        debugger;
        var res = this.soap(tt);
        debugger
        const {image} = this.props.data;
        let bytes = base64.encode(this.state.imageSource);
        debugger;


        debugger;


    }

    selectPhotoTapped() {
        debugger;
        const options = {
            quality: 1.0,
            maxWidth: 200,
            maxHeight: 200,
            storageOptions: {
                skipBackup: true
            }
        };

        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled photo picker');
                debugger;

            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
            else {
                //let source = { uri: response.uri };
                this.setState({
                    imageSource: response.uri,
                    imgCode: response.data
                });
                debugger;


            }
        });
    }


    renderIsImageLoaded() {

        if (this.state.imageSource == null) {
            return (
                <View style={{flex: 2, backgroundColor: 'transparent'}}>

                    <TouchableOpacity style={styles.selectImageButtonStyle}

                                      onPress={this.selectPhotoTapped.bind(this)}
                    >
                        <Image style={{height: 27, width: 27}}
                               source={require('./Image/select.png')}
                        />

                        <Text style={{fontSize: 23, marginLeft: 5}}>

                            Select image file</Text>

                    </TouchableOpacity>

                </View>

            )
        }
        else {
            return (
                <View style={styles.selectImageViewStyle}>

                    <Image style={{flex: 1}} source={{uri: this.state.imageSource}}/>
                </View>
            )
        }

    }

    render() {

        let ss = goodCell;

        const {goodCell, badCell, image, remark} = this.props.data;
        debugger;
        return (

            <View style={styles.container}>
                <StatusBar
                    backgroundColor="#303F9F"
                />
                {this.renderModal()}

                <View style={{flex: 1, backgroundColor: 'transparent', flexDirection: 'row'}}>
                    {this.renderIsImageLoaded()}

                    <View style={{flex: 1}}>
                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                            <TouchableOpacity style={styles.submitButton} onPress={() => this.func_submitButtonClick()}>

                                <Text style={{fontSize: 20, color: 'black', fontWeight: 'bold'}}>SUBMIT</Text>

                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View style={{flex: 0.15, marginLeft: 17}}>
                    <Text style={styles.textStyle}>Data Output</Text>
                </View>
                <View style={{flex: 1.2}}>
                    <View style={{flex: 3, flexDirection: 'row', marginLeft: 20}}>
                        <View style={{flex: 1}}>
                            <View style={styles.middleViewLeftStyle}>
                                <Text style={styles.textStyle}>No of good cells:</Text>
                            </View>
                            <View style={styles.middleViewLeftStyle}>
                                <Text style={styles.textStyle}>No of bad cells:</Text>
                            </View>

                            <View style={{
                                flex: 2,
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                                alignItems: 'flex-start',
                                paddingTop: 20
                            }}>
                                <Text style={styles.textStyle}>Remark:</Text>
                            </View>
                        </View>


                        <View style={{flex: 1}}>
                            <View style={{
                                flex: 1, alignItems: 'flex-start', justifyContent: 'center'
                            }}>
                                <View style={styles.textViewStyle}>
                                    <Text style={{fontSize:12, fontWeight:'normal' }}> {goodCell ? goodCell : ''}</Text>
                                </View>
                            </View>
                            <View style={{
                                flex: 1, alignItems: 'flex-start', justifyContent: 'center',

                            }}>
                                <View style={styles.textViewStyle}>
                                    <Text>{badCell ? badCell : ''}</Text>
                                </View>

                            </View>
                            <View style={{flex: 2, alignItems: 'flex-start', justifyContent: 'center',}}>
                                <View style={styles.textViewStyle}>
                                    <Text>{remark ? remark : ''}</Text>
                                </View>
                            </View>

                        </View>
                    </View>
                    <View style={{flex: 2, justifyContent: 'center', alignItems: 'center'}}>
                        <TouchableOpacity style={styles.viewImageButtonStyle} onPress={this._toggleModal}
                        >
                            <Text style={styles.textStyle}>View Image</Text>
                        </TouchableOpacity>


                    </View>

                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    middleViewLeftStyle: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        alignItems: 'flex-start'
    },
    selectImageButtonStyle: {
        flex: 1,
        borderRadius: 10,
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center'
    },
    selectImageViewStyle: {
        flex: 2,
        backgroundColor: 'transparent',
        marginLeft: 10,
        marginTop: 10
    },
    submitButton: {
        height: 50,
        width: 110,
        backgroundColor: 'gray',
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textViewStyle: {
        justifyContent:'center',
        alignItems:'center',
        height: '70%',
        width: '80%',
        borderColor: 'green',
        borderWidth: 1,
    },
    viewImageButtonStyle: {
        height: 50,
        width: 150,
        borderColor: 'black',
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textStyle: {
        fontSize: 20,
        color: 'black'
    }

});
const mapStateToProps = ({auth}) => {
    // email:auth.state.email;
    const {data} = auth;
    return {data};
};

export default connect(mapStateToProps, {
    dataObj
})(ScienceProject);
