import React, { Component } from "react";
import Particles from "react-particles-js";

class ParticleSettings extends Component {
  render() {
    return (
      <div>
           <Particles
            height="1000p" width="100vm"
            id="tsparticles"
            options={{
                background: {
                    color:{
                        value:'#0d47a1'
                    },
                },
                fpsLimit: 60,
                interactivity: {
                    detect_on : 'canvas',
                    events: {
                       enable: 'true',
                       mode:'push' 
                    }
                }
            }
        }
           />
      </div>
    );
  }
}

export default ParticleSettings;
