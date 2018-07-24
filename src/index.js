import React from "react";
import ReactDOM ,{findDOMNode} from "react-dom";
import PropTypes from "prop-types";

class ReactToPrint extends React.Component {

  static propTypes = {
    /** Copy styles over into print window. default: true */
    copyStyles: PropTypes.bool,
    /** auto open print dialog */
    showPreview: PropTypes.bool,
    /** Trigger action used to open browser print */
    trigger: PropTypes.func.isRequired,
    /** Content to be printed */
    content: PropTypes.func.isRequired,
    /** Callback function to trigger before print */
    onBeforePrint: PropTypes.func,
    /** Optional class to pass to the print window body */
    bodyClass: PropTypes.string,
    printButton: PropTypes.element,
    cancelButton: PropTypes.element,
  };

  static defaultProps = {
    copyStyles: true,
    closeAfterPrint: true,
    bodyClass: '',
  };

  triggerPrint(target) {
    if (this.props.onBeforePrint) {
      this.props.onBeforePrint();
    }
    if(!this.props.showPreview){
      //when print right away add time to load
      setTimeout(() => {
        target.contentWindow.focus();
        target.contentWindow.print();
        this.removeWindow(target);
      }, 500);
    }else {
      target.contentWindow.focus();
      target.contentWindow.print();
      this.removeWindow(target);
    }
  }

  manualPrint(target){
    if (this.linkLoaded === this.linkTotal) {
      this.triggerPrint(target);
    }
    if (this.props.copyStyles === false && this.linkTotal === 0){
      this.triggerPrint(target);
    }
  }

  removeWindow(target) {
    // setTimeout(() => {
      target.parentNode.removeChild(target);
    // }, 100);
    //why delay
  }

  handlePrint = () => {
    console.log('handlePrint')
    const {
      content,
      copyStyles,
      onAfterPrint,
      showPreview,
      printButton,
      cancelButton
    } = this.props;
    this.loadtriggered= false

    let printWindow = document.createElement('iframe');
    printWindow.style.position = 'absolute';
    if(showPreview){
      printWindow.style.top = '0px';
      printWindow.style.left = '0px';
      printWindow.style.width = '800px';
      printWindow.style.height = '100vh';
      printWindow.style.borderWidth = '0px 2px';
      printWindow.style.backgroundColor = '#fff';
    }else {
      printWindow.style.top = '-1000px';
      printWindow.style.left = '-1000px';

    }

    const contentEl = content();
    const contentNodes = findDOMNode(contentEl);

    const linkNodes = document.querySelectorAll('link[rel="stylesheet"]');

    this.linkTotal = linkNodes.length || 0;
    this.linkLoaded = 0;

    const markLoaded = (type) => {

      this.linkLoaded++;

      if (this.linkLoaded === this.linkTotal&&!showPreview) {
        this.triggerPrint(printWindow);
      }

    };

    printWindow.onload = () => {
      if(this.loadtriggered){
        return
      }
      this.loadtriggered= true

      let domDoc = printWindow.contentDocument || printWindow.contentWindow.document;

      domDoc.open();
      domDoc.write(contentNodes.outerHTML);
      domDoc.close();

      let styleEl = domDoc.createElement('style');
      styleEl.appendChild(domDoc.createTextNode(
          "@page { size: auto;  margin: 0mm; }" +
          " @media print {" +
          " body { -webkit-print-color-adjust: exact; }" +
          " .printButtonInnerClassName{display: none;}" +
          " .cancelButtonInnerClassName{display: none;}" +
          "}"));
      domDoc.head.appendChild(styleEl);

      if (printButton) {
        let printELe = React.cloneElement(printButton, {})
        let printNode = document.createElement("div");
        printNode.addEventListener("click", () => {
          this.manualPrint(printWindow)
        })
        ReactDOM.render(printELe, printNode)
        printNode.className += ' printButtonInnerClassName'
        domDoc.body.appendChild(printNode);
      }

      if (cancelButton) {
        let cancelEle = React.cloneElement(cancelButton, {})
        let cancelNode = document.createElement("div");
        cancelNode.addEventListener("click", () => {
          printWindow.style.display = 'none'
          this.removeWindow(printWindow);
        })
        ReactDOM.render(cancelEle, cancelNode)
        cancelNode.className += ' cancelButtonInnerClassName'
        domDoc.body.appendChild(cancelNode);
      }

      if (copyStyles !== false) {

        const headEls = document.querySelectorAll('style, link[rel="stylesheet"]');
        let styleCSS = "";

        [...headEls].forEach(node => {

          if (node.tagName === 'STYLE') {

            if (node.sheet) {
              for (let i = 0; i < node.sheet.cssRules.length; i++) {
                styleCSS += node.sheet.cssRules[i].cssText + "\r\n";
              }

            }

          } else {

            let newHeadEl = domDoc.createElement(node.tagName);

            let attributes = [...node.attributes];
            attributes.forEach(attr => {
              newHeadEl.setAttribute(attr.nodeName, attr.nodeValue);
            });

            newHeadEl.onload = markLoaded.bind(null, 'link');
            newHeadEl.onerror = markLoaded.bind(null, 'link');
            domDoc.head.appendChild(newHeadEl);

          }


        });

        if (styleCSS.length) {
          let newHeadEl = domDoc.createElement('style');
          newHeadEl.setAttribute('id', 'react-to-print');
          newHeadEl.appendChild(domDoc.createTextNode(styleCSS));
          domDoc.head.appendChild(newHeadEl);
        }

      }

      if ((this.linkTotal === 0 || copyStyles === false) && !showPreview) {
        this.triggerPrint(printWindow);
      }
    };

    document.body.appendChild(printWindow);
  }

  render() {

    return React.cloneElement(this.props.trigger(), {
     ref: (el) => this.triggerRef = el,
     onClick: this.handlePrint
    });

  }

}

export default ReactToPrint;
