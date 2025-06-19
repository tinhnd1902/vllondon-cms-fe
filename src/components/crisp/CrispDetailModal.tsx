"use client";

import React, {useState} from 'react';
import {EyeIcon} from '@/assets/icons';
import Button from '../ui/button/Button';
import {useModal} from '@/hooks/useModal';
import Input from '../form/input/InputField';
import Label from '../form/Label';
import {Modal} from '../ui/modal';
import "@/locales/i18n";
import {useTranslation} from "react-i18next";
import {CrispConfigResponse} from "@/modules/crisp/crisp.module";
import CrispWebsiteForm from "@/components/crisp/CrispWebsiteForm";

interface CrispDetailModalProps {
    crisp?: CrispConfigResponse;
}

const CrispDetailModal: React.FC<CrispDetailModalProps> = ({
                                                               crisp,
                                                           }) => {
    const {t} = useTranslation();
    const {isOpen, openModal, closeModal} = useModal();
    const [formData, setFormData] = useState<CrispConfigResponse>({
        id: crisp?.id ?? "",
        createdAt: crisp?.createdAt ?? "",
        crispTokenIdentifier: crisp?.crispTokenIdentifier ?? "",
        crispTokenKey: crisp?.crispTokenKey ?? "",
        websites: crisp?.websites ?? []
    });

    return (
        <>
            <Button className="bg-blue-300" size="sm" variant="primary"
                    startIcon={<EyeIcon/>}
                    onClick={openModal}
            />
            <Modal
                isOpen={isOpen}
                onClose={closeModal}
                className="max-w-[584px] p-5 lg:p-10 max-h-full overflow-y-auto"
            >
                <form>
                    <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90">
                        {t("crisp.detailInfo")}
                    </h4>

                    <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
                        <div className="col-span-2">
                            <Label>{t("crisp.id")}</Label>
                            <Input
                                type="text"
                                name='id'
                                placeholder={t("crisp.id")}
                                disabled={true}
                                defaultValue={formData.id}
                            />
                        </div>

                        <div className="col-span-2">
                            <Label>{t("crisp.identifierCode")}</Label>
                            <Input
                                type="text"
                                name='crispTokenIdentifier'
                                placeholder={t("crisp.identifierCode")}
                                disabled={true}
                                defaultValue={formData.crispTokenIdentifier}
                            />
                        </div>

                        <div className="col-span-1 sm:col-span-2">
                            <Label>{t("crisp.key")}</Label>
                            <Input
                                type="text"
                                name='crispTokenKey'
                                placeholder={t("crisp.key")}
                                disabled={true}
                                defaultValue={formData.crispTokenKey}
                            />
                        </div>
                    </div>

                    <CrispWebsiteForm websites={crisp?.websites} isView={true}/>
                </form>
            </Modal>
        </>
    );
}

export default CrispDetailModal;