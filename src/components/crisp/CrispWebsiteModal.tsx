"use client";

import React, {useEffect, useState} from 'react';
import {SquarePlusIcon} from '@/assets/icons';
import Button from '../ui/button/Button';
import {useModal} from '@/hooks/useModal';
import Input from '../form/input/InputField';
import Label from '../form/Label';
import {Modal} from '../ui/modal';
import "@/locales/i18n";
import {useTranslation} from "react-i18next";
import {CrispWebsitePayload} from "@/modules/crisp/crisp.module";
import {CrispModalState} from "@/components/crisp/CrispModalState";


interface CrispModalProps {
    onSubmit?: (payload: CrispWebsitePayload) => void;
    state: CrispModalState
}

const CrispWebsiteModal: React.FC<CrispModalProps> = ({
                                                          onSubmit,
                                                          state
                                                      }) => {
    const {t} = useTranslation();
    const {isOpen, openModal, closeModal} = useModal();

    const [formData, setFormData] = useState<CrispWebsitePayload>({websiteId: "", name: "", domain: ""});

    useEffect(() => {
        if (state === CrispModalState.HIDDEN_ADD_WEBSITE) {
            closeModal();
        }
    }, [state]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (onSubmit) {
            onSubmit(formData);
        }
    }

    return (
        <>
            <Button className={"bg-green-400 hover:bg-green-500"} size="sm" variant="primary"
                    startIcon={<SquarePlusIcon/>}
                    onClick={openModal}
            >{t("crisp.addWebsite")}</Button>
            <Modal
                isOpen={isOpen}
                onClose={closeModal}
                className="max-w-[584px] p-5 lg:p-10 max-h-full overflow-y-auto"
            >
                <form onSubmit={handleSubmit}>
                    <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90">
                        {t("crisp.addWebsiteToConfigKey")}
                    </h4>

                    <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
                        <div className="col-span-2">
                            <Label>{t("crisp.name")}</Label>
                            <Input
                                type="text"
                                name='name'
                                placeholder={t("crisp.enterName")}
                                defaultValue={formData?.name}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-span-1 sm:col-span-2">
                            <Label>{t("crisp.domain")}</Label>
                            <Input
                                type="text"
                                name='domain'
                                placeholder={t("crisp.enterDomain")}
                                defaultValue={formData?.domain}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-span-1 sm:col-span-2">
                            <Label>{t("crisp.websiteId")}</Label>
                            <Input
                                type="text"
                                name='websiteId'
                                placeholder={t("crisp.enterWebsiteId")}
                                defaultValue={formData?.websiteId}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-end w-full gap-3 mt-6">
                        <Button size="sm">
                            {t("crisp.add")}
                        </Button>
                    </div>
                </form>
            </Modal>
        </>
    );
}

export default CrispWebsiteModal;