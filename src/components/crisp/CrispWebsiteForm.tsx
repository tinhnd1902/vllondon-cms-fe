import React, {useEffect, useState, useCallback} from 'react';
import Input from '../form/input/InputField';
import Label from '../form/Label';
import {useTranslation} from 'react-i18next';
import {CrispWebsiteResponse} from "@/modules/crisp/crisp.module";

export interface CrispWebsiteFormProps {
    websites?: CrispWebsiteResponse[];
    isView: boolean
}

const CrispWebsiteForm: React.FC<CrispWebsiteFormProps> = ({
                                                     websites,
                                                     isView
                                                 }) => {
    const [formData, setFormData] = useState<CrispWebsiteResponse[]>(websites || []);
    const {t} = useTranslation();

    useEffect(() => {
        setFormData(websites || []);
    }, []);

    return (
        <div className="col-span-1 sm:col-span-2 pt-5">
            <Label>{t("crisp.websites")}</Label>
            {(formData.length === 0 && isView) ?
                <Input
                    type="text"
                    name='websites'
                    disabled={true}
                    placeholder={t("crisp.noData")}
                /> :
                <div className='border border-gray-200 dark:border-gray-700 rounded-lg pl-2 pr-1 pb-2 shadow-theme-xs'>
                    {formData.map((website) => (
                        <div className="flex grid-cols-1 pt-2" key={website.id}>
                            <div
                                className=" w-full grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5 rounded-lg bg-white dark:border-white/[0.05] dark:bg-white/[0.03] px-2 py-1">
                                <div className="col-span-2" hidden={!isView}>
                                    <Label>{t("crisp.id")}</Label>
                                    <Input
                                        type="text"
                                        name='id'
                                        placeholder={t("crisp.id")}
                                        disabled={isView}
                                        defaultValue={website.id}
                                    />
                                </div>

                                <div className="col-span-2">
                                    <Label>{t("crisp.websiteId")}</Label>
                                    <Input
                                        type="text"
                                        name='websiteId'
                                        placeholder={t("crisp.websiteId")}
                                        defaultValue={website.websiteId}
                                        disabled={isView}
                                    />
                                </div>

                                <div className="col-span-2">
                                    <Label>{t("crisp.websiteName")}</Label>
                                    <Input
                                        type="text"
                                        name='websiteName'
                                        placeholder={t("crisp.websiteName")}
                                        defaultValue={website.websiteName}
                                        disabled={isView}
                                    />
                                </div>
                                <div className="col-span-2">
                                    <Label>{t("crisp.url")}</Label>
                                    <Input
                                        type="url"
                                        name='websiteUrl'
                                        placeholder={t("crisp.websiteUrl")}
                                        defaultValue={website.websiteUrl}
                                        disabled={isView}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            }
        </div>
    );
}

export default CrispWebsiteForm;