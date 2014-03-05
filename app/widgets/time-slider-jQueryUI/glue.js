var createTimeSlider = function() {
            var appRenderDiv = document.getElementById(renderDiv);

            setDivId("slider", "slider-" + renderDiv);
            var sliderDiv = document.createElement("div");
            sliderDiv.id = getDivId("slider");
            appRenderDiv.appendChild(sliderDiv);

            var sliderPlayDiv = document.createElement("div");
            sliderPlayDiv.className = "G_widget_slider_play";
            sliderPlayDiv.style.width = "40px";
            sliderPlayDiv.style.float = "left";
            sliderDiv.appendChild(sliderPlayDiv);

            var imageParent = document.getElementById(getDivId("slider")).getElementsByClassName("G_widget_slider_play")[0];
            setDivId("playImage", "image-" + renderDiv);
            var playImage = document.createElement("img");
            playImage.className = "play-button";
            playImage.src = "tools/bubble-chart/images/play.png"; // TODO: Do not include src here, the className is enough. Move src to css as url()
            imageParent.appendChild(playImage);

            var sliderWidgetDiv = document.createElement("div");
            sliderWidgetDiv.className = "G_widget_slider";
            sliderWidgetDiv.style.marginLeft = "50px";
            sliderDiv.appendChild(sliderWidgetDiv);

            var sliderWidgetScale = document.createElement("div");
            sliderWidgetScale.className = "G_widget_slider_scale";
            sliderWidgetScale.style.marginLeft = "50px";
            sliderWidgetScale.style.marginTop = "10px";
            sliderWidgetScale.style.position = "relative";
            sliderDiv.appendChild(sliderWidgetScale);
        };