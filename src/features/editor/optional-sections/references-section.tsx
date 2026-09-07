"use client";

import React from "react";
import { useCVStore } from "@/store/useCVStore";
import { generateId } from "@/utils/id.utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2, Users2, ShieldCheck, EyeOff } from "lucide-react";
import { useTranslation } from "@/i18n";

export function ReferencesSection() {
  const { t, language } = useTranslation();
  const references = useCVStore(
    (state) => state.cvData.optionalSections?.references ?? { enabled: false, onDemand: false, items: [] }
  );
  const addReference = useCVStore((state) => state.addReference);
  const updateReference = useCVStore((state) => state.updateReference);
  const removeReference = useCVStore((state) => state.removeReference);
  const setReferencesOnDemand = useCVStore((state) => state.setReferencesOnDemand);
  const toggleOptionalSection = useCVStore((state) => state.toggleOptionalSection);

  const handleAdd = () => {
    addReference({
      id: generateId(),
      name: "",
      position: "",
      company: "",
      email: "",
      phone: "",
      relationship: "",
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between pb-1">
        <span className="text-xs text-slate-500">
          {t.optionalSections.references.helper}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => toggleOptionalSection("references", false)}
          className="h-7 text-xs text-slate-400 hover:text-red-600 hover:bg-red-50"
        >
          <EyeOff className="h-3 w-3 mr-1" />
          {t.editor.optionalSectionPicker.hideSection}
        </Button>
      </div>

      {/* On-demand toggle banner */}
      <div className="flex items-start gap-3 p-3 rounded-lg border border-border/80 bg-muted/30">
        <input
          type="checkbox"
          id="references-on-demand"
          checked={references.onDemand}
          onChange={(e) => setReferencesOnDemand(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary mt-0.5"
        />
        <div className="space-y-0.5">
          <Label htmlFor="references-on-demand" className="text-xs font-medium cursor-pointer">
            {t.optionalSections.references.onDemandLabel}
          </Label>
          <p className="text-[11px] text-muted-foreground">
            {t.optionalSections.references.onDemandHelp}
          </p>
        </div>
      </div>

      {!references.onDemand && (
        <>
          {references.items.length === 0 ? (
            <Card className="border-dashed bg-muted/20">
              <CardContent className="flex flex-col items-center justify-center py-6 text-center text-muted-foreground">
                <Users2 className="h-8 w-8 mb-2 opacity-50" />
                <p className="text-sm font-medium">{t.optionalSections.references.emptyTitle}</p>
                <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                  {t.optionalSections.references.emptyDesc}
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAdd}
                  className="mt-3 gap-1 h-8"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>{t.optionalSections.references.addButton}</span>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {references.items.map((item, index) => (
                <Card key={item.id} className="border border-border/80 shadow-xs">
                  <CardContent className="p-3.5 space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-muted text-muted-foreground">
                        {language === "en" ? `Referee #${index + 1}` : `Pemberi Referensi #${index + 1}`}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeReference(item.id)}
                        className="h-7 px-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                        aria-label={t.common.delete}
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-1" />
                        <span className="text-xs">{t.common.delete}</span>
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                      <div className="space-y-1">
                        <Label htmlFor={`ref-name-${item.id}`} className="text-xs font-medium">
                          {t.optionalSections.references.nameLabel} <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id={`ref-name-${item.id}`}
                          placeholder={t.optionalSections.references.namePlaceholder}
                          value={item.name}
                          onChange={(e) =>
                            updateReference(item.id, { name: e.target.value })
                          }
                          className="h-8 text-xs"
                        />
                      </div>

                      <div className="space-y-1">
                        <Label htmlFor={`ref-pos-${item.id}`} className="text-xs font-medium">
                          {t.optionalSections.references.positionLabel} <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id={`ref-pos-${item.id}`}
                          placeholder={t.optionalSections.references.positionPlaceholder}
                          value={item.position}
                          onChange={(e) =>
                            updateReference(item.id, { position: e.target.value })
                          }
                          className="h-8 text-xs"
                        />
                      </div>

                      <div className="space-y-1">
                        <Label htmlFor={`ref-comp-${item.id}`} className="text-xs font-medium">
                          {t.optionalSections.references.companyLabel} <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id={`ref-comp-${item.id}`}
                          placeholder={t.optionalSections.references.companyPlaceholder}
                          value={item.company}
                          onChange={(e) =>
                            updateReference(item.id, { company: e.target.value })
                          }
                          className="h-8 text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                      <div className="space-y-1">
                        <Label htmlFor={`ref-email-${item.id}`} className="text-xs font-medium">
                          {t.optionalSections.references.emailLabel}
                        </Label>
                        <Input
                          id={`ref-email-${item.id}`}
                          type="email"
                          placeholder={t.optionalSections.references.emailPlaceholder}
                          value={item.email || ""}
                          onChange={(e) =>
                            updateReference(item.id, { email: e.target.value })
                          }
                          className="h-8 text-xs"
                        />
                      </div>

                      <div className="space-y-1">
                        <Label htmlFor={`ref-phone-${item.id}`} className="text-xs font-medium">
                          {t.optionalSections.references.phoneLabel}
                        </Label>
                        <Input
                          id={`ref-phone-${item.id}`}
                          placeholder={t.optionalSections.references.phonePlaceholder}
                          value={item.phone || ""}
                          onChange={(e) =>
                            updateReference(item.id, { phone: e.target.value })
                          }
                          className="h-8 text-xs"
                        />
                      </div>

                      <div className="space-y-1">
                        <Label htmlFor={`ref-rel-${item.id}`} className="text-xs font-medium">
                          {language === "en" ? "Relationship (Optional)" : "Hubungan (Opsional)"}
                        </Label>
                        <Input
                          id={`ref-rel-${item.id}`}
                          placeholder={language === "en" ? "e.g. Former Direct Supervisor" : "Mantan Atasan Langsung"}
                          value={item.relationship || ""}
                          onChange={(e) =>
                            updateReference(item.id, { relationship: e.target.value })
                          }
                          className="h-8 text-xs"
                        />
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
                {t.optionalSections.references.addButton}
              </Button>
            </div>
          )}
        </>
      )}

      {references.onDemand && (
        <div className="flex items-center gap-2 p-3 text-xs text-muted-foreground bg-muted/40 rounded border border-border">
          <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>
            {language === "en"
              ? 'Privacy mode active. The CV will display "References available upon request". Individual contact details will not appear on print output.'
              : 'Mode privasi aktif. Pada CV akan dicantumkan "Referensi tersedia atas permintaan". Data kontak individu tidak ditampilkan di hasil cetak.'}
          </span>
        </div>
      )}
    </div>
  );
}
