import React, {Dispatch, SetStateAction} from "react";
import {Alert, Button, ButtonProps, Form, Input, Modal, Space, Tooltip, TooltipProps} from "antd";
import "./inspector.css";
import {VNCEvent} from "../../../Interfaces/VNC/VNCEvent";
import {useTranslation} from "react-i18next";
import {TooltipAlignConfig} from "antd/es/tooltip";
import {useAppSelector} from "../../../Hook/useAppSelector";
import {AppState} from "../../../Store/RootReducer";
import VncSocketCheckbox from "./VNCSocketCheckbox";
import VNCTextModeCheckbox from "./VNCTextModeCheckbox";
import VNCScreenViewCheckbox from "./VNCScreenViewCheckbox";
import sendCommand from "../../../Requests/Commands/sendCommands";

interface IVncControlsProps {
    currentControl: VNCEvent,
    setCurrentControl: Dispatch<SetStateAction<VNCEvent>>,
    sendVNCCommand: (event: VNCEvent, payload: Record<string, any>) => void,
    selectedBotId: string | null,
    textModeIsEnabled: boolean,
    setTextModeIsEnabled: Dispatch<SetStateAction<boolean>>,
    disableScreenView: boolean,
    setDisableScreenView: Dispatch<SetStateAction<boolean>>,
    setSendText: Dispatch<SetStateAction<string>>,
}

const VncControls: React.FC<IVncControlsProps> = (props: IVncControlsProps) => {
    const {t} = useTranslation();

    const botVNCReducer = useAppSelector((state: AppState) => state.botVNC);

    const tooltipConfig: TooltipProps & TooltipAlignConfig = {
        placement: "topLeft",
        overlay: null,
        className: "vnc-tooltip",
        destroyTooltipOnHide: true,
        overlayInnerStyle: {
            padding: "2px 8px",
            minHeight: "auto",
            pointerEvents: "none",
        },
        overlayStyle: {
            pointerEvents: "none",
        },
        trigger: ["contextMenu"],
    };

    const buttonsState: ButtonProps = {
        disabled: props.selectedBotId === null,
    };

    const [form] = Form.useForm();

    return (
        <>
            <div className="vnc-controls">
                <div className="vnc-controls-head">
                    <h3>
                        {t("VNC_CONTROLS")}
                    </h3>
                </div>
                <div style={{position: "relative", height: "100%"}}>
                    <div className="vnc-controls-sticky" style={{position: "sticky", top: 90, left: 0}}>
                        <Alert
                            description={t("VNC_CONTROLS_HINT")}
                            closable={true}
                            type="success"
                            style={{
                                padding: 10,
                                marginBottom: 15,
                            }}
                        />
                        <Space size={5} direction="vertical" className="vnc-controls-side">
                            <div className="vnc-controls-row">
                                <div className="vnc-controls-col">
                                    <Space size={5} direction="vertical">
                                        {!botVNCReducer.isActive ? (
                                            <Tooltip {...tooltipConfig} title={t("VNC_START")}>
                                                <Button
                                                    {...buttonsState}
                                                    type="default"
                                                    icon={(
                                                        <span className="anticon">
                                                            <i className="fa-solid fa-play"/>
                                                        </span>
                                                    )}
                                                    size="large"
                                                    onClick={() => props.sendVNCCommand("start_vnc", {})}
                                                />
                                            </Tooltip>
                                        ) : (
                                            <Tooltip {...tooltipConfig} title={t("VNC_STOP")}>
                                                <Button
                                                    {...buttonsState}
                                                    type="default"
                                                    icon={(
                                                        <span className="anticon">
                                                            <i className="fa-solid fa-stop"/>
                                                        </span>
                                                    )}
                                                    size="large"
                                                    onClick={() => props.sendVNCCommand("stop_vnc", {})}
                                                />
                                            </Tooltip>
                                        )}
                                    </Space>
                                </div>
                                <div className="vnc-controls-col">
                                    <Space className="vnc-controls-type" size={5} style={{flexWrap: "wrap"}}>
                                        <Tooltip {...tooltipConfig} title={t("VNC_TAP")}>
                                            <Button
                                                {...buttonsState}
                                                type={props.currentControl === "tap" ? "primary" : "default"}
                                                onClick={() => props.setCurrentControl("tap")}
                                                icon={(
                                                    <span className="anticon">
                                                        <i className="icon-longtap" style={{fontSize: 22}}/>
                                                    </span>
                                                )}
                                                size="large"
                                            />
                                        </Tooltip>
                                        <Tooltip {...tooltipConfig} title={t("VNC_LONG_PRESS")}>
                                            <Button
                                                {...buttonsState}
                                                type={props.currentControl === "longpress" ? "primary" : "default"}
                                                onClick={() => props.setCurrentControl("longpress")}
                                                icon={(
                                                    <span className="anticon">
                                                        <i className="icon-longtap" style={{fontSize: 22}}/>
                                                    </span>
                                                )}
                                                size="large"
                                            />
                                        </Tooltip>
                                        <Tooltip {...tooltipConfig} title={t("VNC_CUT_TEXT")}>
                                            <Button
                                                {...buttonsState}
                                                type={props.currentControl === "cuttext" ? "primary" : "default"}
                                                onClick={() => props.setCurrentControl("cuttext")}
                                                icon={(
                                                    <span className="anticon">
                                                        <i className="icon-cuttext" style={{fontSize: 22}}/>
                                                    </span>
                                                )}
                                                size="large"
                                            />
                                        </Tooltip>
                                        <Tooltip {...tooltipConfig} title={t("VNC_CLICK_AT_TEXT")}>
                                            <Button
                                                {...buttonsState}
                                                type={props.currentControl === "clickattext" ? "primary" : "default"}
                                                onClick={() => props.setCurrentControl("clickattext")}
                                                icon={(
                                                    <span className="anticon">
                                                        <i className="icon-clickattext" style={{fontSize: 22}}/>
                                                    </span>
                                                )}
                                                size="large"
                                            />
                                        </Tooltip>
                                        <Tooltip {...tooltipConfig} title={t("VNC_CLICK_AT_CONTAIN_TEXT")}>
                                            <Button
                                                {...buttonsState}
                                                type={props.currentControl === "clickatcontaintext" ? "primary" : "default"}
                                                onClick={() => props.setCurrentControl("clickatcontaintext")}
                                                icon={(
                                                    <span className="anticon">
                                                        <i className="icon-clickattext"/>
                                                    </span>
                                                )}
                                                size="large"
                                            />
                                        </Tooltip>
                                        <Tooltip {...tooltipConfig} title={t("VCN_SWIPE")}>
                                            <Button
                                                {...buttonsState}
                                                type={props.currentControl === "swipe" ? "primary" : "default"}
                                                onClick={() => props.setCurrentControl("swipe")}
                                                icon={(
                                                    <span className="anticon">
                                                        <i className="icon-swipe"/>
                                                    </span>
                                                )}
                                                size="large"
                                            />
                                        </Tooltip>
                                        <Tooltip {...tooltipConfig} title={t("VNC_CLICK_AT")}>
                                            <Button
                                                {...buttonsState}
                                                type={props.currentControl === "clickat" ? "primary" : "default"}
                                                onClick={() => props.setCurrentControl("clickat")}
                                                icon={(
                                                    <span className="anticon">
                                                        <i className="icon-swipe"/>
                                                    </span>
                                                )}
                                                size="large"
                                            />
                                        </Tooltip>
                                    </Space>
                                </div>
                            </div>
                            <div className="vnc-controls-row" style={{marginTop: 30}}>
                                <div className="vnc-controls-col">
                                    <Space size={5} direction="vertical">
                                        <Tooltip {...tooltipConfig} title={t("VNC_SCROLL_UP")}>
                                            <Button
                                                {...buttonsState}
                                                type={props.currentControl === "scrollup" ? "primary" : "default"}
                                                onClick={() => props.setCurrentControl("scrollup")}
                                                icon={(
                                                    <span className="anticon" title={"scrollup"}>
                                                        <i className="fa-solid fa-angles-up"/>
                                                    </span>
                                                )}
                                                size="large"
                                            />
                                        </Tooltip>
                                        <Tooltip {...tooltipConfig} title={t("VNC_SCROLL_DOWN")}>
                                            <Button
                                                {...buttonsState}
                                                type={props.currentControl === "scrolldown" ? "primary" : "default"}
                                                onClick={() => props.setCurrentControl("scrolldown")}
                                                icon={(
                                                    <span className="anticon" title={"scrolldown"}>
                                                        <i className="fa-solid fa-angles-down"/>
                                                    </span>
                                                )}
                                                size="large"
                                            />
                                        </Tooltip>
                                    </Space>
                                </div>
                                <div className="vnc-controls-col">
                                    <div className="vnc-controls-grid">
                                        <div className="vnc-btn"></div>
                                        <div className="vnc-btn">
                                            <Tooltip {...tooltipConfig} title={t("VNC_SWIPE_UP")}>
                                                <Button
                                                    {...buttonsState}
                                                    type={props.currentControl === "swipeup" ? "primary" : "default"}
                                                    onClick={() => props.setCurrentControl("swipeup")}
                                                    icon={(
                                                        <span className="anticon" title={"swipeup"}>
                                                            <i className="fa-solid fa-chevron-up"/>
                                                        </span>
                                                    )}
                                                    size="large"
                                                />
                                            </Tooltip>
                                        </div>
                                        <div className="vnc-btn"></div>
                                        <div className="vnc-btn">
                                            <Tooltip {...tooltipConfig} title={t("VNC_SWIPE_LEFT")}>
                                                <Button
                                                    {...buttonsState}
                                                    type={props.currentControl === "swipeleft" ? "primary" : "default"}
                                                    onClick={() => props.setCurrentControl("swipeleft")}
                                                    icon={(
                                                        <span className="anticon" title={"swipeleft"}>
                                                            <i className="fa-solid fa-chevron-left"/>
                                                        </span>
                                                    )}
                                                    size="large"
                                                />
                                            </Tooltip>
                                        </div>
                                        <div className="vnc-btn">
                                            <Tooltip {...tooltipConfig} title={t("VNC_SWIPE_DOWN")}>
                                                <Button
                                                    {...buttonsState}
                                                    type={props.currentControl === "swipedown" ? "primary" : "default"}
                                                    onClick={() => props.setCurrentControl("swipedown")}
                                                    icon={(
                                                        <span className="anticon" title={"swipedown"}>
                                                            <i className="fa-solid fa-chevron-down"/>
                                                        </span>
                                                    )}
                                                    size="large"
                                                />
                                            </Tooltip>
                                        </div>
                                        <div className="vnc-btn">
                                            <Tooltip {...tooltipConfig} title={t("VNC_SWIPE_RIGHT")}>
                                                <Button
                                                    {...buttonsState}
                                                    type={props.currentControl === "swiperight" ? "primary" : "default"}
                                                    onClick={() => props.setCurrentControl("swiperight")}
                                                    icon={(
                                                        <span className="anticon" title={"swiperight"}>
                                                            <i className="fa-solid fa-chevron-right"/>
                                                        </span>
                                                    )}
                                                    size="large"
                                                />
                                            </Tooltip>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="vnc-controls-row" style={{marginTop: 30}}>
                                <div className="vnc-controls-bottom">
                                    <Tooltip {...tooltipConfig} title={t("VNC_SCROLL_UP")}>
                                        <Button
                                            {...buttonsState}
                                            type="default"
                                            icon={(
                                                <span className="anticon">
                                                    <i className="fa-solid fa-bars"/>
                                                </span>
                                            )}
                                            size="large"
                                            onClick={() => props.sendVNCCommand("onkeyevent", {
                                                key: "recents",
                                            })}
                                        />
                                    </Tooltip>
                                    <Tooltip {...tooltipConfig} title={t("VNC_SCROLL_UP")}>
                                        <Button
                                            {...buttonsState}
                                            type="default"
                                            icon={(
                                                <span className="anticon">
                                                    <i className="fa-regular fa-square"/>
                                                </span>
                                            )}
                                            size="large"
                                            onClick={() => props.sendVNCCommand("onkeyevent", {
                                                key: "home",
                                            })}
                                        />
                                    </Tooltip>
                                    <Tooltip {...tooltipConfig} title={t("VNC_SCROLL_UP")}>
                                        <Button
                                            {...buttonsState}
                                            type="default"
                                            icon={(
                                                <span className="anticon">
                                                    <i className="fa-solid fa-chevron-left"/>
                                                </span>
                                            )}
                                            size="large"
                                            onClick={() => props.sendVNCCommand("onkeyevent", {
                                                key: "back",
                                            })}
                                        />
                                    </Tooltip>
                                    <Tooltip {...tooltipConfig} title={t("VNC_SCROLL_UP")}>
                                        <Button
                                            {...buttonsState}
                                            type="default"
                                            icon={(
                                                <span className="anticon">
                                                    <i className="fa-solid fa-power-off"/>
                                                </span>
                                            )}
                                            size="large"
                                            onClick={() => props.sendVNCCommand("onkeyevent", {
                                                key: "power_dialog",
                                            })}
                                        />
                                    </Tooltip>
                                </div>
                            </div>
                            <div className="vnc-controls-row" style={{marginTop: 30}}>
                                <div className="vnc-controls-bottom">
                                    <Tooltip {...tooltipConfig} title="lock">
                                        <Button
                                            {...buttonsState}
                                            type="default"
                                            icon={(
                                                <span className="anticon">
                                                    <i className="fa-solid fa-lock"/>
                                                </span>
                                            )}
                                            size="large"
                                            onClick={() => props.sendVNCCommand("onkeyevent", {
                                                key: "lock",
                                            })}
                                        />
                                    </Tooltip>
                                    <Tooltip {...tooltipConfig} title="unlock">
                                        <Button
                                            {...buttonsState}
                                            type="default"
                                            icon={(
                                                <span className="anticon">
                                                    <i className="fa-solid fa-unlock"/>
                                                </span>
                                            )}
                                            size="large"
                                            onClick={() => {
                                                props.sendVNCCommand("onkeyevent", {
                                                    key: "unlock",
                                                });

                                                if (props.selectedBotId) {
                                                    sendCommand({
                                                        command: "unlock",
                                                        payload: {},
                                                        botIds: [props.selectedBotId || ""],
                                                    });
                                                }
                                            }}
                                        />
                                    </Tooltip>

                                    <Tooltip {...tooltipConfig} title="addview">
                                        <Button
                                            {...buttonsState}
                                            type="default"
                                            icon={(
                                                <span className="anticon">
                                                    <i className="fa-solid fa-mobile-button" />
                                                </span>
                                            )}
                                            size="large"
                                            onClick={() => {
                                                if (props.selectedBotId) {
                                                    sendCommand({
                                                        command: "addview",
                                                        payload: {},
                                                        botIds: [props.selectedBotId || ""],
                                                    });
                                                }
                                            }}
                                        />
                                    </Tooltip>
                                    <Tooltip {...tooltipConfig} title="removeview">
                                        <Button
                                            {...buttonsState}
                                            type="default"
                                            icon={(
                                                <span className="anticon">
                                                    <i className="fa-solid fa-mobile-screen-button" />
                                                </span>
                                            )}
                                            size="large"
                                            onClick={() => {
                                                if (props.selectedBotId) {
                                                    sendCommand({
                                                        command: "removeview",
                                                        payload: {},
                                                        botIds: [props.selectedBotId || ""],
                                                    });
                                                }
                                            }}
                                        />
                                    </Tooltip>
                                </div>
                            </div>
                            <div className="vnc-controls-row" style={{marginTop: 30}}>
                                <Tooltip {...tooltipConfig} title="Set text">
                                    <Button
                                        {...buttonsState}
                                        type={props.currentControl === "settext" ? "primary" : "default"}
                                        icon={(
                                            <span className="anticon">
                                                <i className="fa-solid fa-font" />
                                            </span>
                                        )}
                                        size="large"
                                        onClick={() => Modal.confirm({
                                            title: "Set text",
                                            content: (
                                                <Form
                                                    form={form}
                                                    layout="vertical"
                                                >
                                                    <Form.Item name="text">
                                                        <Input placeholder="Text" />
                                                    </Form.Item>
                                                </Form>
                                            ),
                                            onOk: () => {
                                                props.setSendText(form.getFieldValue("text"));
                                                props.setCurrentControl("settext");
                                            },
                                        })}
                                    />
                                </Tooltip>
                            </div>
                            <div className="vnc-controls-row" style={{marginTop: 30}}>
                                <Space size={5} direction="vertical">
                                    <Tooltip {...tooltipConfig} title={t("VNC_SCROLL_UP")}>
                                        <VNCTextModeCheckbox
                                            textModeIsEnabled={props.textModeIsEnabled}
                                            setTextModeIsEnabled={props.setTextModeIsEnabled}/> Text mode
                                    </Tooltip>
                                    <Tooltip {...tooltipConfig} title={t("VNC_SCROLL_UP")}>
                                        <VNCScreenViewCheckbox
                                            disableScreenView={props.disableScreenView}
                                            setDisableScreenView={props.setDisableScreenView}/> Disable screen view
                                    </Tooltip>
                                    <Tooltip {...tooltipConfig} title={t("VNC_SCROLL_DOWN")}>
                                        <VncSocketCheckbox /> Sockets
                                    </Tooltip>
                                </Space>
                            </div>
                        </Space>
                    </div>
                </div>
            </div>
        </>
    );
};

export default VncControls;
