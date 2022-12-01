import {Component, ElementRef, OnInit} from '@angular/core';
import {ImageCompressionService} from "./image-compression.service";

@Component({
  selector: 'image-compression',
  templateUrl: './image-compression.component.html',
  styleUrls: ['./image-compression.component.css']
})
export class ImageCompressionComponent implements OnInit {
  selectedFile: File = {} as File;
  image: any = new Image();
  imageShow: boolean = false;
  url: any; //Angular 11, for stricter type
  msg = ""
  constructor(private imageCompressionsService: ImageCompressionService, private element: ElementRef) {


  }

  ngOnInit(): void {

  }

  onFileChanged(event: Event) {

    const target =  event.target as HTMLInputElement;

    // @ts-ignore
    if(!target?.files[0] || target?.files[0].length == 0) {
      this.msg = 'You must select an image';
      return;
    }

    var mimeType = target?.files[0].type;

    if (mimeType.match(/image\/*/) == null) {
      this.msg = "Only images are supported";
      return;
    }

    var reader = new FileReader();
    reader.readAsDataURL(target?.files[0]);
    console.log(reader);

    reader.onload = (_event) => {
      this.msg = "";
      this.url = reader.result;
      this.image.src =  reader.result;
    }



  }

  /**
   * Convert the uploaded image to an offscreen canvas item, so we can read the image data without displaying.
   */
  async onUpload() {
    let colorMap = new Map<string, number>();
    var bitmap = await createImageBitmap(this.image);
    var canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
    var context = canvas.getContext('2d');
    context?.drawImage(bitmap,0,0);
    var myData = context?.getImageData(0, 0, bitmap.width, bitmap.height);
    var hexData = this.convertImageDataToHex(myData as ImageData, colorMap);

    console.log(hexData);

    console.log(`Original: ${getSizeInBytes({obj: myData?.data})} vs Hexdata: ${getSizeInBytes({obj: hexData})}`);

  }

  /**
   * Convert the image data from RGBA to hex values.
   * @param imageData
   * @param colorMap
   */
  convertImageDataToHex(imageData : ImageData, colorMap: Map<string, number>) {

    let hexArrayAsString = '';

    for(var i = 0; i < imageData.data.length ; i+=4){

      let hexValue = this.combineRGBAToHexString(imageData.data[i], imageData.data[i+1], imageData.data[i+2], imageData.data[i+3]);
      hexArrayAsString+=`#${(this.getColorValue(hexValue, Math.floor(i/4), colorMap))}`;
    }
    console.log(colorMap);

    return(hexArrayAsString);

  }

  /**
   * This function will utilization memoization by checking if we have already added a color to the string. Or if it's new
   * color it will record the first index that color was at, so it could be reference later. If a color is repeated we will return the color
   * as a string with prefix of m. This will be used later when rebuilding the image, so it references the correct color.
   * @param hexColor - 0-255 color/alpha value of a pixel.
   * @param index - index the color/alpha value is at.
   * @param colorMap - map containing all the previous seen colors.
   */
  getColorValue(hexColor: string, index: number, colorMap: Map<string, number>) {
    if(!colorMap.has(hexColor)){
      colorMap.set(hexColor, index)
      return hexColor;
    }

    return `m${colorMap.get(hexColor)}`;
  }

  /**
   * Combines the RBGA values into one string.
   * @param red
   * @param green
   * @param blue
   * @param alpha
   */
  combineRGBAToHexString (red:number, green: number, blue: number, alpha: number){

    return `${red.toString(16)}${green.toString(16)}${blue.toString(16)}${alpha.toString(16)}`;
  }
}

/**
 *
 * @param obj
 */
const getSizeInBytes = ({obj}: { obj: any }) => {
  let str = null;
  if (typeof obj === 'string') {
    // If obj is a string, then use it
    str = obj;
  } else {
    // Else, make obj into a string
    str = JSON.stringify(obj);
  }
  // Get the length of the Uint8Array
  return new TextEncoder().encode(str).length;
};
