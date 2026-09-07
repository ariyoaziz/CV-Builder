export type Language = "id" | "en";

export interface Translations {
  common: {
    add: string;
    edit: string;
    delete: string;
    save: string;
    cancel: string;
    hide: string;
    show: string;
    reorder: string;
    optional: string;
    required: string;
    confirm: string;
    back: string;
    loading: string;
    search: string;
    close: string;
  };
  header: {
    brandSubtitle: string;
    documentTitleFallback: string;
    documentMenu: string;
    exportJSON: string;
    importJSON: string;
    resetCV: string;
    printPDF: string;
    printShort: string;
    importAriaLabel: string;
    languageSwitcherAria: string;
    selectIndonesian: string;
    selectEnglish: string;
    resetDialogTitle: string;
    resetDialogDesc: string;
    resetDialogCancel: string;
    resetDialogConfirm: string;
    importSuccessToast: string;
    resetSuccessToast: string;
    aboutHelp: string;
    backToEditor: string;
    aiAssistant: string;
    pasteJSON: string;
    pasteJSONAriaLabel: string;
  };
  sections: {
    personalInfo: string;
    summary: string;
    experience: string;
    education: string;
    skills: string;
    projects: string;
    certifications: string;
    organizations: string;
    languages: string;
    awards: string;
    courses: string;
    licenses: string;
    volunteer: string;
    publications: string;
    portfolio: string;
    references: string;
    interests: string;
  };
  editor: {
    personalInfo: {
      title: string;
      fullName: string;
      fullNamePlaceholder: string;
      headline: string;
      headlinePlaceholder: string;
      email: string;
      emailPlaceholder: string;
      phone: string;
      phonePlaceholder: string;
      location: string;
      locationPlaceholder: string;
      linkedin: string;
      linkedinPlaceholder: string;
      github: string;
      githubPlaceholder: string;
      website: string;
      websitePlaceholder: string;
      showFullLinks: string;
      showFullLinksHelp: string;
      photoUrl: string;
      photoUrlPlaceholder: string;
      photoHelp: string;
      removePhoto: string;
    };
    summary: {
      title: string;
      placeholder: string;
      helper: string;
      characterCount: string;
    };
    experience: {
      title: string;
      position: string;
      positionPlaceholder: string;
      company: string;
      companyPlaceholder: string;
      location: string;
      locationPlaceholder: string;
      startDate: string;
      endDate: string;
      currentJob: string;
      description: string;
      descriptionPlaceholder: string;
      descriptionHelp: string;
      addButton: string;
      emptyTitle: string;
      emptyDesc: string;
    };
    education: {
      title: string;
      institution: string;
      institutionPlaceholder: string;
      degree: string;
      degreePlaceholder: string;
      fieldOfStudy: string;
      fieldOfStudyPlaceholder: string;
      startDate: string;
      endDate: string;
      currentStudy: string;
      gpa: string;
      gpaPlaceholder: string;
      description: string;
      descriptionPlaceholder: string;
      addButton: string;
      emptyTitle: string;
      emptyDesc: string;
    };
    skills: {
      title: string;
      categoryName: string;
      categoryPlaceholder: string;
      skillsList: string;
      skillsListPlaceholder: string;
      skillsListHelp: string;
      addCategoryButton: string;
      emptyTitle: string;
      emptyDesc: string;
      mainSkillsDefaultCategory: string;
    };
    projects: {
      title: string;
      name: string;
      namePlaceholder: string;
      role: string;
      rolePlaceholder: string;
      url: string;
      urlPlaceholder: string;
      startDate: string;
      endDate: string;
      currentProject: string;
      description: string;
      descriptionPlaceholder: string;
      addButton: string;
      emptyTitle: string;
      emptyDesc: string;
    };
    certifications: {
      name: string;
      namePlaceholder: string;
      issuer: string;
      issuerPlaceholder: string;
      issueDate: string;
      expiryDate: string;
      credentialId: string;
      credentialIdPlaceholder: string;
      url: string;
      urlPlaceholder: string;
      addButton: string;
      emptyTitle: string;
      emptyDesc: string;
    };
    organizations: {
      name: string;
      namePlaceholder: string;
      role: string;
      rolePlaceholder: string;
      startDate: string;
      endDate: string;
      currentRole: string;
      description: string;
      descriptionPlaceholder: string;
      addButton: string;
      emptyTitle: string;
      emptyDesc: string;
    };
    optionalSectionPicker: {
      title: string;
      subtitle: string;
      hideSection: string;
    };
    deleteConfirm: {
      title: string;
      description: string;
      cancel: string;
      confirm: string;
    };
  };
  optionalSections: {
    languages: {
      title: string;
      languageLabel: string;
      languagePlaceholder: string;
      proficiencyLabel: string;
      proficiencies: {
        basic: string;
        intermediate: string;
        advanced: string;
        fluent: string;
        native: string;
      };
      addButton: string;
      emptyTitle: string;
      emptyDesc: string;
      helper: string;
    };
    awards: {
      title: string;
      nameLabel: string;
      namePlaceholder: string;
      issuerLabel: string;
      issuerPlaceholder: string;
      dateLabel: string;
      descriptionLabel: string;
      descriptionPlaceholder: string;
      addButton: string;
      emptyTitle: string;
      emptyDesc: string;
      helper: string;
    };
    courses: {
      title: string;
      nameLabel: string;
      namePlaceholder: string;
      providerLabel: string;
      providerPlaceholder: string;
      startDateLabel: string;
      endDateLabel: string;
      certificateUrlLabel: string;
      certificateUrlPlaceholder: string;
      addButton: string;
      emptyTitle: string;
      emptyDesc: string;
      helper: string;
    };
    licenses: {
      title: string;
      nameLabel: string;
      namePlaceholder: string;
      issuerLabel: string;
      issuerPlaceholder: string;
      licenseNumberLabel: string;
      licenseNumberPlaceholder: string;
      issueDateLabel: string;
      expiryDateLabel: string;
      addButton: string;
      emptyTitle: string;
      emptyDesc: string;
      helper: string;
    };
    volunteer: {
      title: string;
      organizationLabel: string;
      organizationPlaceholder: string;
      roleLabel: string;
      rolePlaceholder: string;
      startDateLabel: string;
      endDateLabel: string;
      currentRole: string;
      descriptionLabel: string;
      descriptionPlaceholder: string;
      addButton: string;
      emptyTitle: string;
      emptyDesc: string;
      helper: string;
    };
    publications: {
      title: string;
      titleLabel: string;
      titlePlaceholder: string;
      publisherLabel: string;
      publisherPlaceholder: string;
      typeLabel: string;
      typePlaceholder: string;
      dateLabel: string;
      urlLabel: string;
      urlPlaceholder: string;
      descriptionLabel: string;
      descriptionPlaceholder: string;
      addButton: string;
      emptyTitle: string;
      emptyDesc: string;
      helper: string;
    };
    portfolio: {
      title: string;
      labelName: string;
      labelPlaceholder: string;
      urlLabel: string;
      urlPlaceholder: string;
      addButton: string;
      emptyTitle: string;
      emptyDesc: string;
      helper: string;
    };
    references: {
      title: string;
      nameLabel: string;
      namePlaceholder: string;
      companyLabel: string;
      companyPlaceholder: string;
      positionLabel: string;
      positionPlaceholder: string;
      emailLabel: string;
      emailPlaceholder: string;
      phoneLabel: string;
      phonePlaceholder: string;
      onDemandLabel: string;
      onDemandHelp: string;
      addButton: string;
      emptyTitle: string;
      emptyDesc: string;
      helper: string;
    };
    interests: {
      title: string;
      tagLabel: string;
      tagPlaceholder: string;
      tagHelp: string;
      emptyTitle: string;
      emptyDesc: string;
      helper: string;
    };
  };
  preview: {
    paperSize: string;
    zoomIn: string;
    zoomOut: string;
    fitPage: string;
    resetZoom: string;
    printPDF: string;
    templateSelect: string;
    referencesOnDemand: string;
    present: string;
    emptyCVPrompt: string;
  };
  date: {
    monthPlaceholder: string;
    yearPlaceholder: string;
    present: string;
    months: string[];
  };
  mobileNav: {
    edit: string;
    preview: string;
    templates: string;
  };
  validation: {
    required: string;
    invalidEmail: string;
    invalidUrl: string;
  };
  aboutHelp: {
    pageTitle: string;
    pageDescription: string;
    backToEditor: string;
    hero: {
      badge: string;
      title: string;
      description: string;
    };
    nav: {
      gettingStarted: string;
      about: string;
      targetUsers: string;
      privacySecurity: string;
      howItWorks: string;
      templates: string;
      ats: string;
      faq: string;
    };
    gettingStarted: {
      title: string;
      subtitle: string;
      steps: Array<{
        step: number;
        title: string;
        desc: string;
      }>;
    };
    about: {
      title: string;
      subtitle: string;
      whatIsTitle: string;
      whatIsDesc: string;
      createdByTitle: string;
      createdByDesc: string;
      createdByName: string;
      purposeTitle: string;
      purposeDesc: string;
      purposes: string[];
    };
    targetUsers: {
      title: string;
      subtitle: string;
      personas: Array<{
        title: string;
        desc: string;
      }>;
      industryTitle: string;
      industryDesc: string;
    };
    privacySecurity: {
      title: string;
      subtitle: string;
      storageTitle: string;
      storageDesc: string;
      serverTitle: string;
      serverDesc: string;
      accountTitle: string;
      accountDesc: string;
      risksTitle: string;
      risksDesc: string;
      backupTitle: string;
      backupDesc: string;
    };
    howItWorks: {
      title: string;
      subtitle: string;
      steps: Array<{
        step: number;
        title: string;
        desc: string;
      }>;
    };
    templates: {
      title: string;
      subtitle: string;
      note: string;
      items: Array<{
        name: string;
        desc: string;
      }>;
    };
    ats: {
      title: string;
      subtitle: string;
      whatIsTitle: string;
      whatIsDesc: string;
      builderTitle: string;
      builderDesc: string;
      tipsTitle: string;
      tips: string[];
    };
    faq: {
      title: string;
      subtitle: string;
      categories: {
        general: {
          name: string;
          items: Array<{ q: string; a: string }>;
        };
        ats: {
          name: string;
          items: Array<{ q: string; a: string }>;
        };
        editor: {
          name: string;
          items: Array<{ q: string; a: string }>;
        };
        templates: {
          name: string;
          items: Array<{ q: string; a: string }>;
        };
        importExport: {
          name: string;
          items: Array<{ q: string; a: string }>;
        };
        printPdf: {
          name: string;
          items: Array<{ q: string; a: string }>;
        };
        language: {
          name: string;
          items: Array<{ q: string; a: string }>;
        };
      };
    };
  };
  aiAssistant: {
    modalTitle: string;
    modalSubtitle: string;
    privacyDisclaimerTitle: string;
    privacyDisclaimerText: string;
    workflowTitle: string;
    workflowSteps: string[];
    workflowExplain: string;
    threeComponentsTitle: string;
    componentTemplateTitle: string;
    componentTemplateDesc: string;
    componentAiTitle: string;
    componentAiDesc: string;
    componentImportTitle: string;
    componentImportDesc: string;
    aiVsVisualTitle: string;
    aiVsVisualExplain: string;
    aiVsVisualExample: string;
    modeLabel: string;
    modeFromScratch: string;
    modeFromScratchDesc: string;
    modeImproveExisting: string;
    modeImproveExistingDesc: string;
    presetLabel: string;
    targetPositionLabel: string;
    targetPositionPlaceholder: string;
    targetIndustryLabel: string;
    targetIndustryPlaceholder: string;
    jobDescriptionLabel: string;
    jobDescriptionPlaceholder: string;
    userNotesLabel: string;
    userNotesPlaceholder: string;
    promptOutputLanguage: string;
    copyPromptAndSchemaBtn: string;
    copyPromptBtn: string;
    copySchemaBtn: string;
    copySuccessToast: string;
    copySchemaSuccessToast: string;
    copyPromptAndSchemaSuccessToast: string;
    nextStepTitle: string;
    nextStepDesc: string;
    openImportBtn: string;
    previewPromptLabel: string;
  };
  pasteJson: {
    dialogTitle: string;
    dialogSubtitle: string;
    pasteLabel: string;
    pastePlaceholder: string;
    validateBtn: string;
    candidatePreviewTitle: string;
    candidateName: string;
    candidateHeadline: string;
    candidateExperienceCount: string;
    candidateEducationCount: string;
    candidateSkillsCount: string;
    candidateProjectsCount: string;
    jsonValidBadge: string;
    jsonInvalidBadge: string;
    useThisCvBtn: string;
    importSuccessToast: string;
    importNote: string;
  };
}
