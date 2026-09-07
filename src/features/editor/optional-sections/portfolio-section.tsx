"use client";

import React, { useState } from "react";
import { useCVStore } from "@/store/useCVStore";
import { generateId } from "@/utils/id.utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2, Globe, ExternalLink, EyeOff } from "lucide-react";
import { useTranslation } from "@/i18n";

export function PortfolioSection() {
  const { t, language } = useTranslation();
  const portfolio = useCVStore(
    (state) => state.cvData.optionalSections?.portfolio ?? { enabled: false, items: [] }
  );
  const addPortfolioLink = useCVStore((state) => state.addPortfolioLink);
  const updatePortfolioLink = useCVStore((state) => state.updatePortfolioLink);
  const removePortfolioLink = useCVStore((state) => state.removePortfolioLink);
  const toggleOptionalSection = useCVStore((state) => state.toggleOptionalSection);

  const [urlErrors, setUrlErrors] = useState<Record<string, string>>({});

  const handleAdd = () => {
    addPortfolioLink({
      id: generateId(),
      label: "",
      url: "",
    });
  };

  const validateUrl = (id: string, value: string) => {
    if (!value) {
      setUrlErrors((prev) => ({ ...prev, [id]: "" }));
      return;
    }
    if (!value.startsWith("http://") && !value.startsWith("https://")) {
      setUrlErrors((prev) => ({
        ...prev,
        [id]: language === "en" ? "URL must start with http:// or https://" : "URL harus diawali dengan http:// atau https://",
      }));
    } else if (value.toLowerCase().startsWith("javascript:")) {
      setUrlErrors((prev) => ({
        ...prev,
        [id]: language === "en" ? "javascript: protocol is not allowed" : "Protokol javascript: tidak diperbolehkan",
      }));
    } else {
      setUrlErrors((prev) => ({ ...prev, [id]: "" }));
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between pb-1">
        <span className="text-xs text-slate-500">
          {t.optionalSections.portfolio.helper}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => toggleOptionalSection("portfolio", false)}
          className="h-7 text-xs text-slate-400 hover:text-red-600 hover:bg-red-50"
        >
          <EyeOff className="h-3 w-3 mr-1" />
          {t.editor.optionalSectionPicker.hideSection}
        </Button>
      </div>

      {portfolio.items.length === 0 ? (
        <Card className="border-dashed bg-muted/20">
          <CardContent className="flex flex-col items-center justify-center py-6 text-center text-muted-foreground">
            <Globe className="h-8 w-8 mb-2 opacity-50" />
            <p className="text-sm font-medium">{t.optionalSections.portfolio.emptyTitle}</p>
            <p className="text-xs text-muted-foreground mt-1 max-w-xs">
              {t.optionalSections.portfolio.emptyDesc}
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAdd}
              className="mt-3 gap-1 h-8"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>{t.optionalSections.portfolio.addButton}</span>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {portfolio.items.map((item, index) => (
            <Card key={item.id} className="border border-border/80 shadow-xs">
              <CardContent className="p-3.5">
                <div className="flex items-start justify-between gap-2 mb-2.5">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-muted text-muted-foreground">
                    {language === "en" ? `Link #${index + 1}` : `Tautan #${index + 1}`}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removePortfolioLink(item.id)}
                    className="h-7 px-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                    aria-label={t.common.delete}
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1" />
                    <span className="text-xs">{t.common.delete}</span>
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor={`portfolio-label-${item.id}`} className="text-xs font-medium">
                      {t.optionalSections.portfolio.labelName} <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id={`portfolio-label-${item.id}`}
                      placeholder={t.optionalSections.portfolio.labelPlaceholder}
                      value={item.label}
                      onChange={(e) =>
                        updatePortfolioLink(item.id, { label: e.target.value })
                      }
                      className="h-8 text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor={`portfolio-url-${item.id}`} className="text-xs font-medium">
                      {t.optionalSections.portfolio.urlLabel} <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id={`portfolio-url-${item.id}`}
                        placeholder={t.optionalSections.portfolio.urlPlaceholder}
                        value={item.url}
                        onChange={(e) => {
                          updatePortfolioLink(item.id, { url: e.target.value });
                          validateUrl(item.id, e.target.value);
                        }}
                        className={`h-8 text-xs pr-8 ${
                          urlErrors[item.id] ? "border-destructive focus-visible:ring-destructive" : ""
                        }`}
                        aria-invalid={!!urlErrors[item.id]}
                        aria-describedby={urlErrors[item.id] ? `url-err-${item.id}` : undefined}
                      />
                      {item.url && !urlErrors[item.id] && (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute right-2 top-2 text-muted-foreground hover:text-foreground"
                          title={language === "en" ? "Open link" : "Buka tautan"}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                    {urlErrors[item.id] && (
                      <p id={`url-err-${item.id}`} className="text-[11px] text-destructive">
                        {urlErrors[item.id]}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAdd}
            className="w-full gap-1.5 text-xs mt-1 border-dashed"
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={1.75} />
            {t.optionalSections.portfolio.addButton}
          </Button>
        </div>
      )}
    </div>
  );
}
