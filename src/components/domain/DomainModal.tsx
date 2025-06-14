"use client";

import React, { useState } from 'react';
import { ChevronDownIcon, EditIcon, SquarePlusIcon } from '@/assets/icons';
import Button from '../ui/button/Button';
import { useModal } from '@/hooks/useModal';
import Input from '../form/input/InputField';
import Label from '../form/Label';
import { Modal } from '../ui/modal';
import Select from '../form/Select';
import { DomainPayload, DomainResponse, DomainStatus } from '@/modules/domain/domain.module';
import DomainService from '@/services/domain.service';
import Toast, { ToastInfo, ToastVariant } from '../ui/toast/Toast';
import "@/locales/i18n";
import { useTranslation } from "react-i18next";

interface DomainProps {
    isCreate: boolean;
    domain?: DomainResponse;
    onReload?: () => void;
}

const DomainModal: React.FC<DomainProps> = ({
    isCreate,
    domain,
    onReload
}) => {
    const { t } = useTranslation();
    const { isOpen, openModal, closeModal } = useModal();
    const [toastInfo, setToastInfo] = useState<ToastInfo>({ show: false, message: '', variant: ToastVariant.SUCCESS });
    const [formData, setFormData] = useState<DomainPayload>({
        code: domain?.code || '',
        name: domain?.name || '',
        url: domain?.url || '',
        status: domain?.status || DomainStatus.INACTIVE,
    });

    const options = [
        { value: DomainStatus.ACTIVE, label: t(`domain.${DomainStatus.ACTIVE}`) },
        { value: DomainStatus.INACTIVE, label: t(`domain.${DomainStatus.INACTIVE}`) },
    ];

    const handleSelectChange = (value: string) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            status: value as DomainStatus,
        }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const updateDomain = () => {
        if (!domain || !domain.id) {
            setToastInfo({
                show: true,
                message: t("domain.fail_update_no_domain"),
                variant: ToastVariant.ERROR
            });
            return;
        }
        DomainService.updateDomainByIdRequest(domain.id, formData)
            .then(() => {
                setToastInfo({
                    show: true,
                    message: t("domain.success_update", { name: domain.name }),
                    variant: ToastVariant.SUCCESS
                });
                setTimeout(() => {
                    onReload?.();
                    closeModal();
                }, 1000);
            }, (error) => {
                setToastInfo({
                    show: true,
                    message: t("domain.fail_update", { name: domain.name, error: error?.message || t("unknown") }),
                    variant: ToastVariant.ERROR
                });
            })
    }

    const createDomain = () => {
        if (!formData) {
            setToastInfo({
                show: true,
                message: t("domain.fail_create_no_data"),
                variant: ToastVariant.ERROR
            });
            return;
        }
        DomainService.createDomainRequest(formData)
            .then(() => {
                setToastInfo({
                    show: true,
                    message: t("domain.success_create", { name: formData.name }),
                    variant: ToastVariant.SUCCESS
                });
                setTimeout(() => {
                    onReload?.();
                    closeModal();
                }, 1000);
            }, (error) => {
                setToastInfo({
                    show: true,
                    message: t("domain.fail_create", { error: error?.message || t("unknown") }),
                    variant: ToastVariant.ERROR
                });
            })
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isCreate) {
            createDomain();
        } else {
            updateDomain();
        }
    }

    return (
        <>
            <Button className={isCreate ? "bg-green-400 hover:bg-green-500" : "bg-blue-300"} size="sm" variant="primary"
                startIcon={isCreate ? <SquarePlusIcon /> : <EditIcon />}
                onClick={openModal}
            > {isCreate ? t("domain.create_btn") : <></>} </Button>
            <Modal
                isOpen={isOpen}
                onClose={closeModal}
                className="max-w-[584px] p-5 lg:p-10"
            >
                <form onSubmit={handleSubmit}>
                    <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90">
                        {isCreate ? t("domain.create") : t("domain.update")}
                    </h4>

                    <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
                        <div className="col-span-1" >
                            <Label>{t("domain.code")}</Label>
                            <Input
                                type="text"
                                name='code'
                                placeholder={t("domain.code")}
                                disabled={!isCreate}
                                defaultValue={domain?.code}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-span-1">
                            <Label>{t("domain.name")}</Label>
                            <Input
                                type="text"
                                name='name'
                                placeholder={t("domain.name")}
                                defaultValue={domain?.name}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-span-1 sm:col-span-2">
                            <Label>{t("domain.url")}</Label>
                            <Input
                                type="text"
                                name='url'
                                placeholder="https://example.com"
                                defaultValue={domain?.url}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-span-1">
                            <Label>{t("domain.status")}</Label>
                            <div className="relative">
                                <Select
                                    options={options}
                                    placeholder={t("domain.status")}
                                    onChange={handleSelectChange}
                                    className="dark:bg-dark-900"
                                    defaultValue={domain?.status}
                                />
                                <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                                    <ChevronDownIcon />
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-end w-full gap-3 mt-6">
                        <Button size="sm">
                            {t("domain.save_btn")}
                        </Button>
                    </div>
                </form>
            </Modal>
            <Toast
                variant={toastInfo.variant}
                title={t("notification")}
                message={toastInfo.message}
                show={toastInfo.show}
                onClose={() => setToastInfo({ show: false, message: '', variant: ToastVariant.SUCCESS })}
            />
        </>
    );
}

export default DomainModal;