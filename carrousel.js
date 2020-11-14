var listOfItems=[];
var separationAngleRad;
var rotationRad;
var interval;
var movingState=0;
var zIndexMinimum=0;
var targetId;

var movingStates = {
    "notMoving" : 0,
    "movingFreely" : 1,
    "movingToTargetCounterclockwise" : 2,
    "movingToTargetClockwise" : 3
}

function addItem(html,tag, order=null, attributes=[]){
    let item = {
        html:html,
        tag:tag,
        attributes:attributes
    }
    if(order!=null){
        listOfItems.push(item)
    }else{
        listOfItems.splice(order,0,item);
    }
}

function initCarrousel (carrouselContainer,itemWidth,itemHeight, initialAngleRad=Math.PI/2) {
    var distanceFromCenter = itemWidth/2+2
    separationAngleRad = Math.PI*2/listOfItems.length;
    rotationRad = initialAngleRad;
    carrouselContainer.style.position="absolute"
    for(i in listOfItems){
        let itemProperties = listOfItems[i]

        let angleFromZero = separationAngleRad*i - rotationRad;
        itemProperties.z=Math.sin(angleFromZero)*distanceFromCenter + distanceFromCenter + zIndexMinimum;
        itemProperties.x=Math.cos(angleFromZero)*distanceFromCenter - itemWidth/2;

        let item = document.createElement(itemProperties.tag);
        itemProperties.element=item;
        item.innerHTML = itemProperties.html;
        for(a in itemProperties.attributes){
            let attribute = itemProperties.attributes[a].split('=');
            item.setAttribute(attribute[0],attribute[1])
        }

        item.style.position='absolute'
        item.style.width=itemWidth+'px';
        item.style.height=itemHeight+'px';
        item.style.overflow='hidden';
        item.style.zIndex=itemProperties.z;

        item.setAttribute("onmouseover",'elementHovered(this,event)')
        item.setAttribute("onmouseleave", 'mouseLeft(event)')
        item.setAttribute("carrId",i);

        let xOffset = carrouselContainer.clientWidth/2+itemProperties.x
        item.style.transform="translateX("+xOffset+"px)";
        
        carrouselContainer.appendChild(item);

        movingState=1;
        startCarrousel(carrouselContainer, itemWidth, distanceFromCenter);
    }
}

function startCarrousel(carrouselContainer, itemWidth, distanceFromCenter){
    var rotationOffset = Math.PI/360
    

    interval = setInterval(function(){
        if(movingState!=movingStates.notMoving){
            switch(movingState){
                case movingStates.movingFreely: rotationRad += rotationOffset; break;
                case movingStates.movingToTargetCounterclockwise:
                    if(listOfItems[targetId].x<0){
                        rotationRad += rotationOffset*4
                    }else{
                        movingState=movingStates.notMoving
                    }
                    break;
                case movingStates.movingToTargetClockwise:
                    if(listOfItems[targetId].x>0){
                        rotationRad -= rotationOffset*4
                    }else{
                        movingState=movingStates.notMoving
                    }
                    break;
                default: console.log("brokem");break;
            }
            
            for(i in listOfItems){
                let itemProperties = listOfItems[i];
                let angleFromZero = separationAngleRad*i - rotationRad;
                itemProperties.z=Math.sin(angleFromZero)*(distanceFromCenter) + distanceFromCenter + zIndexMinimum;
                itemProperties.x=Math.cos(angleFromZero)*(distanceFromCenter);
                itemProperties.element.style.zIndex=Math.round(itemProperties.z);
                itemProperties.element.setAttribute('x',itemProperties.x);
                let xOffset = carrouselContainer.clientWidth/2+itemProperties.x-itemWidth/2;
                let scale = 0.7+0.3*Math.sin(angleFromZero);
                itemProperties.element.style.transform="translateX("+xOffset+"px) scale("+scale+")";
                itemProperties.element.style.opacity=scale;
            }
        }
    },40)
}

function elementHovered(element,event){
    if(movingState==movingStates.notMoving || movingState==movingStates.movingFreely){
        targetId=element.getAttribute("carrId");
        console.log(movingState)
        if(listOfItems[targetId].x<0){
            movingState=movingStates.movingToTargetCounterclockwise;
        }else{
            //if(listOfItems[targetId].x==element.width/2)
            movingState=movingStates.movingToTargetClockwise;
        }
        event.stopPropagation();
    }else{
        console.log("failed attempt")
    }
}

function mouseLeft(ev){
    if(ev.toElement.getAttribute('carrid')==null || ev.toElement==null){
        movingState=movingStates.movingFreely;
    }
}

function test(){
    addItem(null,"img",null,["src=Sample-Imgs/montaña.jpg"])
    addItem(null,"img",null,["src=Sample-Imgs/arbol.webp"])
    addItem(null,"img",null,["src=Sample-Imgs/paris.jpg"])
    // addItem(null,"img",null,["src=Sample-Imgs/montaña.jpg"])
    // addItem(null,"img",null,["src=Sample-Imgs/arbol.webp"])
    // addItem(null,"img",null,["src=Sample-Imgs/paris.jpg"])
    // addItem("<p>Uno</p>","div",null,["style=background-color:green;margin:0;padding:0"])
    // addItem("<p>Dos</p>","div",null,["style=background-color:cyan;margin:0;padding:0"])
    initCarrousel(document.getElementById("div"),200,null)
}