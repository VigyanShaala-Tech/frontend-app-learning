import React from "react";
import {PLUGIN_OPERATIONS, DIRECT_PLUGIN} from "@openedx/frontend-plugin-framework";
import  Header  from '@edx/frontend-component-header';

const getPluginSlots = () => {
    return {
        learning_mfe_header_plugin_slot: {
            plugins: [
                {
                    op: PLUGIN_OPERATIONS.Insert,
                    widget:{
                        id: "learning_mfe_header_plugin_slot",
                        type: DIRECT_PLUGIN,
                        priority: 1,
                        RenderWidget: (props)=>(
                            <Header />
                        )
                    }
                }
            ]
        },
    }
}

const config = {
    ...process.env,
    get pluginSlots() {
        return getPluginSlots();
    }
}

export default config;