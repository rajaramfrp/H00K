import React from "react";
import {ModalWithSelectedBotsProps} from "../../../Model/Modal";
import {Form, Modal, Space} from "antd";
import {getBotsId} from "../../../Util/getBotIds";
import sendCommand from "../../../Requests/Commands/sendCommands";
import {customStyles, customStylesLight, inputRules} from "../../../Util/config";
import {AppState} from "../../../Store/RootReducer";
import CreatableSelect from "react-select/creatable";
import {useTranslation} from "react-i18next";
import {useAppSelector} from "../../../Hook/useAppSelector";

const DeleteApp: React.FC<ModalWithSelectedBotsProps> = (props: ModalWithSelectedBotsProps) => {
    const renderTitle = (title: string) => (
        <span>
            {title}
        </span>
    );

    const renderItem = (app: string) => ({
        value: app,
        label: (
            <Space size={10}>
                {app}
            </Space>
        ),
    });

    const options: any[] = [];

    if (props.selectedBots.length === 1) {
        props.selectedBots[0].applications?.forEach((application) => {
            options.push({
                label: renderTitle(application),
                options: [renderItem(application)],
            });
        });
    }

    const [form] = Form.useForm();

    const closeModal = () => {
        props.setVisible(false);
        form.resetFields();
    };
    const formSubmit = () => {
        sendCommand({
            command: "deleteapplication",
            payload: {
                app: form.getFieldsValue()["app"].value,
            },
            botIds: getBotsId(props.selectedBots),
        });

        closeModal();
    };

    const {t} = useTranslation();

    const settingsReducer = useAppSelector((state: AppState) => state.settings);

    return (
        <Modal
            title={(
                <>
                    <i className="fa-solid fa-trash-can-arrow-up" /> {t("DELETE_APP")}
                </>
            )}
            open={props.visible}
            onCancel={closeModal}
            onOk={() => form.submit()}
            okText={t("DELETE")}
            cancelText={t("MODAL_BUTTON_CANCEL")}
            width={340}
            destroyOnClose
        >
            <Form form={form} layout="vertical" onFinish={formSubmit}>
                <Form.Item label={t("SELECT_APP")} name="app" rules={inputRules}>
                    <CreatableSelect
                        styles={settingsReducer.theme === "light" ? customStylesLight : customStyles}
                        options={options}
                        placeholder={t("SELECT_APP")}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default DeleteApp;
