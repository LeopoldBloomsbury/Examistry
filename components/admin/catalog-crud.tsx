import {
  deleteAssetAction,
  deleteCouponAction,
  deleteExamAction,
  deleteGuideAction,
  deleteLessonAction,
  deleteModuleAction,
  deletePackAction,
  deletePromoBannerAction,
  deleteSectionAction,
  upsertAssetAction,
  upsertCouponAction,
  upsertExamAction,
  upsertGuideAction,
  upsertLessonAction,
  upsertModuleAction,
  upsertPackAction,
  upsertPromoBannerAction,
  upsertSectionAction
} from "@/lib/admin/actions";
import { AdminSubmitButton } from "@/components/admin/admin-form-controls";
import {
  Badge,
  Card,
  CheckboxField,
  Field,
  Input,
  Select,
  SectionHeading,
  Textarea
} from "@/components/shared/ui";
import type { CouponCampaign, Exam, FreeGuide, PromoBanner, StudyPack } from "@/types";

function lines(items: string[]) {
  return items.join("\n");
}

function detailLines(items: { label: string; value: string }[]) {
  return items.map((item) => `${item.label}::${item.value}`).join("\n");
}

function faqLines(items: { question: string; answer: string }[]) {
  return items.map((item) => `${item.question}::${item.answer}`).join("\n");
}

function formatUseCaseLines(
  items: {
    id: string;
    title: string;
    body: string;
    packSlugs: string[];
  }[]
) {
  return items
    .map((item) => `${item.id}|${item.title}|${item.body}|${item.packSlugs.join(",")}`)
    .join("\n");
}

function FormShell({
  action,
  title,
  subtitle,
  children,
  writable,
  deleteAction,
  deleteId
}: {
  action: (formData: FormData) => Promise<void>;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  writable: boolean;
  deleteAction?: (formData: FormData) => Promise<void>;
  deleteId?: string;
}) {
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold tracking-tight text-zinc-950">{title}</h3>
          {subtitle ? <p className="mt-2 text-sm leading-7 text-zinc-600">{subtitle}</p> : null}
        </div>
        {deleteAction && deleteId ? (
          <form action={deleteAction}>
            <input type="hidden" name="id" value={deleteId} />
            <AdminSubmitButton label="Delete" pendingLabel="Deleting..." variant="outline" />
          </form>
        ) : null}
      </div>
      <form action={action} className="mt-6 space-y-5">
        <fieldset disabled={!writable} className="space-y-5 disabled:opacity-60">
          {children}
          <AdminSubmitButton label="Save" pendingLabel="Saving..." />
        </fieldset>
      </form>
    </Card>
  );
}

export function AdminExamCrud({
  exams,
  writable
}: {
  exams: Exam[];
  writable: boolean;
}) {
  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Admin"
        title="Manage exams and sections"
        description="Structured fields keep future verticals durable without introducing a CMS before the product needs one."
      />
      {!writable ? (
        <Card className="border-dashed">
          <p className="text-sm leading-7 text-zinc-600">
            Write actions are disabled until Supabase admin credentials are configured. The forms
            below are production-ready when the service role key is present.
          </p>
        </Card>
      ) : null}

      {exams.map((exam) => (
        <div key={exam.id} className="space-y-6">
          <FormShell
            action={upsertExamAction}
            title={exam.name}
            subtitle={exam.description}
            writable={writable}
            deleteAction={deleteExamAction}
            deleteId={exam.id}
          >
            <input type="hidden" name="id" value={exam.id} />
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Slug">
                <Input name="slug" defaultValue={exam.slug} />
              </Field>
              <Field label="Sort order">
                <Input name="sortOrder" type="number" defaultValue={exam.sortOrder} />
              </Field>
            </div>
            <Field label="Name">
              <Input name="name" defaultValue={exam.name} />
            </Field>
            <Field label="Description">
              <Textarea name="description" defaultValue={exam.description} />
            </Field>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Hero title">
                <Input name="heroTitle" defaultValue={exam.heroTitle} />
              </Field>
              <Field label="Free guide slug">
                <Input name="freeGuideSlug" defaultValue={exam.freeGuideSlug} />
              </Field>
            </div>
            <Field label="Hero body">
              <Textarea name="heroBody" defaultValue={exam.heroBody} />
            </Field>
            <Field label="Hero highlights" hint="One line per highlight.">
              <Textarea name="heroHighlights" defaultValue={lines(exam.heroHighlights)} />
            </Field>
            <Field label="Methodology points" hint="One line per point.">
              <Textarea
                name="methodologyPoints"
                defaultValue={lines(exam.methodologyPoints)}
              />
            </Field>
            <Field label="Trust points" hint="One line per point.">
              <Textarea name="trustPoints" defaultValue={lines(exam.trustPoints)} />
            </Field>
            <Field
              label="Use cases"
              hint="One line per use case using id|title|body|pack-slug,pack-slug."
            >
              <Textarea name="useCases" defaultValue={formatUseCaseLines(exam.useCases)} />
            </Field>
            <Field label="Featured pack slugs" hint="One pack slug per line.">
              <Textarea
                name="featuredPackSlugs"
                defaultValue={lines(exam.featuredPackSlugs)}
              />
            </Field>
            <CheckboxField name="active" defaultChecked={exam.isActive}>
              Keep this exam visible on the public site.
            </CheckboxField>
          </FormShell>

          <div className="grid gap-4 md:grid-cols-2">
            {exam.sections.map((section) => (
              <FormShell
                key={section.id}
                action={upsertSectionAction}
                title={section.name}
                subtitle={section.description}
                writable={writable}
                deleteAction={deleteSectionAction}
                deleteId={section.id}
              >
                <input type="hidden" name="id" value={section.id} />
                <input type="hidden" name="examId" value={exam.id} />
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Slug">
                    <Input name="slug" defaultValue={section.slug} />
                  </Field>
                  <Field label="Sort order">
                    <Input name="sortOrder" type="number" defaultValue={section.sortOrder} />
                  </Field>
                </div>
                <Field label="Name">
                  <Input name="name" defaultValue={section.name} />
                </Field>
                <Field label="Description">
                  <Textarea name="description" defaultValue={section.description} />
                </Field>
              </FormShell>
            ))}
          </div>

          <FormShell
            action={upsertSectionAction}
            title={`Add section to ${exam.name}`}
            subtitle="Create a new section without leaving the page."
            writable={writable}
          >
            <input type="hidden" name="examId" value={exam.id} />
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Slug">
                <Input name="slug" placeholder="nclex-rn" />
              </Field>
              <Field label="Sort order">
                <Input name="sortOrder" type="number" defaultValue={exam.sections.length + 1} />
              </Field>
            </div>
            <Field label="Name">
              <Input name="name" placeholder="NCLEX-RN" />
            </Field>
            <Field label="Description">
              <Textarea name="description" placeholder="Short section description" />
            </Field>
          </FormShell>
        </div>
      ))}

      <FormShell
        action={upsertExamAction}
        title="Add exam"
        subtitle="Create a new exam vertical without changing the schema."
        writable={writable}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Slug">
            <Input name="slug" placeholder="nclex" />
          </Field>
          <Field label="Sort order">
            <Input name="sortOrder" type="number" defaultValue={exams.length + 1} />
          </Field>
        </div>
        <Field label="Name">
          <Input name="name" placeholder="NCLEX" />
        </Field>
        <Field label="Description">
          <Textarea name="description" placeholder="Exam overview" />
        </Field>
        <Field label="Hero title">
          <Input name="heroTitle" placeholder="NCLEX study packs designed for clarity" />
        </Field>
        <Field label="Hero body">
          <Textarea name="heroBody" placeholder="Hero body copy" />
        </Field>
        <Field label="Hero highlights" hint="One line per highlight.">
          <Textarea name="heroHighlights" />
        </Field>
        <Field label="Methodology points" hint="One line per point.">
          <Textarea name="methodologyPoints" />
        </Field>
        <Field label="Trust points" hint="One line per point.">
          <Textarea name="trustPoints" />
        </Field>
        <Field label="Use cases" hint="One line per use case using id|title|body|pack-slug,pack-slug.">
          <Textarea name="useCases" />
        </Field>
        <Field label="Featured pack slugs" hint="One pack slug per line.">
          <Textarea name="featuredPackSlugs" />
        </Field>
        <Field label="Free guide slug">
          <Input name="freeGuideSlug" placeholder="nclex-starter-guide" />
        </Field>
        <CheckboxField name="active" defaultChecked>
          Publish this exam vertical immediately.
        </CheckboxField>
      </FormShell>
    </div>
  );
}

export function AdminPackCrud({
  exams,
  packs,
  guides,
  coupons,
  banners,
  writable
}: {
  exams: Exam[];
  packs: StudyPack[];
  guides: FreeGuide[];
  coupons: CouponCampaign[];
  banners: PromoBanner[];
  writable: boolean;
}) {
  const sections = exams.flatMap((exam) =>
    exam.sections.map((section) => ({
      ...section,
      examId: exam.id,
      examName: exam.name
    }))
  );

  return (
    <div className="space-y-10">
      <SectionHeading
        eyebrow="Admin"
        title="Manage packs, guides, assets, and offers"
        description="This is the operational side of the product: catalog, lesson graph, downloads, free-guide delivery, and merchandising metadata."
      />
      {!writable ? (
        <Card className="border-dashed">
          <p className="text-sm leading-7 text-zinc-600">
            Write actions are disabled until Supabase admin credentials are configured.
          </p>
        </Card>
      ) : null}

      {packs.map((pack) => (
        <div key={pack.id} className="space-y-6">
          <FormShell
            action={upsertPackAction}
            title={pack.title}
            subtitle={pack.subtitle}
            writable={writable}
            deleteAction={deletePackAction}
            deleteId={pack.id}
          >
            <input type="hidden" name="id" value={pack.id} />
            <div className="flex flex-wrap gap-2">
              <Badge variant="subtle">{pack.packType}</Badge>
              {pack.sectionSlug ? <Badge variant="subtle">{pack.sectionSlug.toUpperCase()}</Badge> : null}
              <Badge variant="subtle">{pack.modules.length} modules</Badge>
              <Badge variant="subtle">{pack.assets.length} assets</Badge>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Exam">
                <Select name="examId" defaultValue={exams.find((exam) => exam.slug === pack.examSlug)?.id}>
                  {exams.map((exam) => (
                    <option key={exam.id} value={exam.id}>
                      {exam.name}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Section">
                <Select name="sectionId" defaultValue={sections.find((section) => section.slug === pack.sectionSlug)?.id ?? ""}>
                  <option value="">General / bundle</option>
                  {sections.map((section) => (
                    <option key={section.id} value={section.id}>
                      {section.examName} / {section.name}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Slug">
                <Input name="slug" defaultValue={pack.slug} />
              </Field>
              <Field label="Pack type">
                <Select name="packType" defaultValue={pack.packType}>
                  <option value="free">free</option>
                  <option value="one_time">one_time</option>
                  <option value="bundle">bundle</option>
                </Select>
              </Field>
            </div>
            <Field label="Title">
              <Input name="title" defaultValue={pack.title} />
            </Field>
            <Field label="Subtitle">
              <Textarea name="subtitle" defaultValue={pack.subtitle} />
            </Field>
            <Field label="Promise">
              <Textarea name="promise" defaultValue={pack.promise} />
            </Field>
            <Field label="Description">
              <Textarea name="description" defaultValue={pack.description} />
            </Field>
            <div className="grid gap-4 md:grid-cols-3">
              <Field label="Price cents">
                <Input name="priceCents" type="number" defaultValue={pack.priceCents} />
              </Field>
              <Field label="Estimated hours">
                <Input
                  name="estimatedHours"
                  type="number"
                  step="0.5"
                  defaultValue={pack.estimatedHours}
                />
              </Field>
              <Field label="Difficulty">
                <Input name="difficultyLevel" defaultValue={pack.difficultyLevel} />
              </Field>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <Field label="Stripe price ID">
                <Input name="stripePriceId" defaultValue={pack.stripePriceId} />
              </Field>
              <Field label="Badge">
                <Input name="badge" defaultValue={pack.badge} />
              </Field>
              <Field label="Cover image URL">
                <Input name="coverImageUrl" defaultValue={pack.coverImageUrl} />
              </Field>
            </div>
            <Field label="Includes" hint="One line per included item.">
              <Textarea name="includes" defaultValue={lines(pack.includes)} />
            </Field>
            <Field label="Outcomes" hint="One line per outcome.">
              <Textarea name="outcomes" defaultValue={lines(pack.outcomes)} />
            </Field>
            <Field label="Who it's for" hint="One line per audience bullet.">
              <Textarea name="whoItsFor" defaultValue={lines(pack.whoItsFor)} />
            </Field>
            <Field label="Who it's not for" hint="One line per audience bullet.">
              <Textarea name="whoItsNotFor" defaultValue={lines(pack.whoItsNotFor)} />
            </Field>
            <Field label="Format breakdown" hint="One line per item using label::value.">
              <Textarea
                name="formatBreakdown"
                defaultValue={detailLines(pack.formatBreakdown)}
              />
            </Field>
            <Field label="Study fit">
              <Textarea name="studyFit" defaultValue={pack.studyFit} />
            </Field>
            <Field label="Preview notes" hint="One line per note.">
              <Textarea name="previewNotes" defaultValue={lines(pack.previewNotes)} />
            </Field>
            <Field label="FAQ items" hint="One line per item using question::answer.">
              <Textarea name="faqItems" defaultValue={faqLines(pack.faqs)} />
            </Field>
            <Field label="Related pack slugs" hint="One line per slug.">
              <Textarea
                name="relatedPackSlugs"
                defaultValue={lines(pack.relatedPackSlugs)}
              />
            </Field>
            <div className="grid gap-4 md:grid-cols-2">
              <CheckboxField name="isFeatured" defaultChecked={pack.isFeatured}>
                Feature this pack on public landing pages.
              </CheckboxField>
              <CheckboxField name="isActive" defaultChecked={pack.isActive}>
                Keep this pack visible and sellable.
              </CheckboxField>
            </div>
          </FormShell>

          <div className="space-y-4">
            {pack.modules.map((module) => (
              <details key={module.id} className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-panel" open>
                <summary className="cursor-pointer list-none text-lg font-semibold text-zinc-950">
                  {module.title}
                </summary>
                <div className="mt-5 space-y-5">
                  <FormShell
                    action={upsertModuleAction}
                    title="Module"
                    subtitle={module.description}
                    writable={writable}
                    deleteAction={deleteModuleAction}
                    deleteId={module.id}
                  >
                    <input type="hidden" name="id" value={module.id} />
                    <input type="hidden" name="packId" value={pack.id} />
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="Title">
                        <Input name="title" defaultValue={module.title} />
                      </Field>
                      <Field label="Sort order">
                        <Input name="sortOrder" type="number" defaultValue={module.sortOrder} />
                      </Field>
                    </div>
                    <Field label="Description">
                      <Textarea name="description" defaultValue={module.description} />
                    </Field>
                  </FormShell>

                  {module.lessons.map((lesson) => (
                    <FormShell
                      key={lesson.id}
                      action={upsertLessonAction}
                      title={lesson.title}
                      subtitle={lesson.summary}
                      writable={writable}
                      deleteAction={deleteLessonAction}
                      deleteId={lesson.id}
                    >
                      <input type="hidden" name="id" value={lesson.id} />
                      <input type="hidden" name="moduleId" value={module.id} />
                      <div className="grid gap-4 md:grid-cols-3">
                        <Field label="Slug">
                          <Input name="slug" defaultValue={lesson.slug} />
                        </Field>
                        <Field label="Lesson type">
                          <Select name="lessonType" defaultValue={lesson.lessonType}>
                            <option value="reading">reading</option>
                            <option value="checklist">checklist</option>
                            <option value="memorization">memorization</option>
                            <option value="practice">practice</option>
                            <option value="planner">planner</option>
                          </Select>
                        </Field>
                        <Field label="Estimated minutes">
                          <Input
                            name="estimatedMinutes"
                            type="number"
                            defaultValue={lesson.estimatedMinutes}
                          />
                        </Field>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <Field label="Title">
                          <Input name="title" defaultValue={lesson.title} />
                        </Field>
                        <Field label="Sort order">
                          <Input name="sortOrder" type="number" defaultValue={lesson.sortOrder} />
                        </Field>
                      </div>
                      <Field label="Summary">
                        <Textarea name="summary" defaultValue={lesson.summary} />
                      </Field>
                      <Field label="Markdown content">
                        <Textarea
                          name="contentMarkdown"
                          defaultValue={lesson.contentMarkdown}
                          className="min-h-[220px]"
                        />
                      </Field>
                      <CheckboxField name="isPreview" defaultChecked={lesson.isPreview}>
                        Allow public preview access for this lesson.
                      </CheckboxField>
                    </FormShell>
                  ))}

                  <FormShell
                    action={upsertLessonAction}
                    title="Add lesson"
                    subtitle="Create a new lesson in this module."
                    writable={writable}
                  >
                    <input type="hidden" name="moduleId" value={module.id} />
                    <div className="grid gap-4 md:grid-cols-3">
                      <Field label="Slug">
                        <Input name="slug" placeholder="new-lesson" />
                      </Field>
                      <Field label="Lesson type">
                        <Select name="lessonType" defaultValue="reading">
                          <option value="reading">reading</option>
                          <option value="checklist">checklist</option>
                          <option value="memorization">memorization</option>
                          <option value="practice">practice</option>
                          <option value="planner">planner</option>
                        </Select>
                      </Field>
                      <Field label="Estimated minutes">
                        <Input name="estimatedMinutes" type="number" defaultValue={10} />
                      </Field>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="Title">
                        <Input name="title" placeholder="Lesson title" />
                      </Field>
                      <Field label="Sort order">
                        <Input
                          name="sortOrder"
                          type="number"
                          defaultValue={module.lessons.length + 1}
                        />
                      </Field>
                    </div>
                    <Field label="Summary">
                      <Textarea name="summary" />
                    </Field>
                    <Field label="Markdown content">
                      <Textarea name="contentMarkdown" className="min-h-[220px]" />
                    </Field>
                    <CheckboxField name="isPreview">Allow preview access.</CheckboxField>
                  </FormShell>
                </div>
              </details>
            ))}
          </div>

          <FormShell
            action={upsertModuleAction}
            title={`Add module to ${pack.title}`}
            subtitle="Create a new module without leaving the pack page."
            writable={writable}
          >
            <input type="hidden" name="packId" value={pack.id} />
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Title">
                <Input name="title" placeholder="New module" />
              </Field>
              <Field label="Sort order">
                <Input name="sortOrder" type="number" defaultValue={pack.modules.length + 1} />
              </Field>
            </div>
            <Field label="Description">
              <Textarea name="description" />
            </Field>
          </FormShell>

          <div className="grid gap-4 md:grid-cols-2">
            {pack.assets.map((asset) => (
              <FormShell
                key={asset.id}
                action={upsertAssetAction}
                title={asset.title}
                subtitle={asset.description}
                writable={writable}
                deleteAction={deleteAssetAction}
                deleteId={asset.id}
              >
                <input type="hidden" name="id" value={asset.id} />
                <input type="hidden" name="packId" value={pack.id} />
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Title">
                    <Input name="title" defaultValue={asset.title} />
                  </Field>
                  <Field label="File type">
                    <Input name="fileType" defaultValue={asset.fileType} />
                  </Field>
                </div>
                <Field label="File path">
                  <Input name="filePath" defaultValue={asset.href} />
                </Field>
                <Field label="Lesson ID">
                  <Input name="lessonId" defaultValue={asset.lessonId} />
                </Field>
                <Field label="Description">
                  <Textarea name="description" defaultValue={asset.description} />
                </Field>
                <CheckboxField name="isPreview" defaultChecked={asset.isPreview}>
                  Make this asset downloadable on the public preview.
                </CheckboxField>
              </FormShell>
            ))}
          </div>

          <FormShell
            action={upsertAssetAction}
            title={`Add asset to ${pack.title}`}
            subtitle="Store a downloadable file path and optional lesson association."
            writable={writable}
          >
            <input type="hidden" name="packId" value={pack.id} />
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Title">
                <Input name="title" placeholder="Asset title" />
              </Field>
              <Field label="File type">
                <Input name="fileType" placeholder="pdf" />
              </Field>
            </div>
            <Field label="File path">
              <Input name="filePath" placeholder="/previews/new-asset.html" />
            </Field>
            <Field label="Lesson ID">
              <Input name="lessonId" placeholder="Optional lesson UUID" />
            </Field>
            <Field label="Description">
              <Textarea name="description" />
            </Field>
            <CheckboxField name="isPreview">Make this a public preview asset.</CheckboxField>
          </FormShell>
        </div>
      ))}

      <FormShell
        action={upsertPackAction}
        title="Add pack"
        subtitle="Create a new paid pack, bundle, or free sample pack."
        writable={writable}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Exam">
            <Select name="examId" defaultValue={exams[0]?.id}>
              {exams.map((exam) => (
                <option key={exam.id} value={exam.id}>
                  {exam.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Section">
            <Select name="sectionId" defaultValue="">
              <option value="">General / bundle</option>
              {sections.map((section) => (
                <option key={section.id} value={section.id}>
                  {section.examName} / {section.name}
                </option>
              ))}
            </Select>
          </Field>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Slug">
            <Input name="slug" placeholder="new-pack-slug" />
          </Field>
          <Field label="Pack type">
            <Select name="packType" defaultValue="one_time">
              <option value="free">free</option>
              <option value="one_time">one_time</option>
              <option value="bundle">bundle</option>
            </Select>
          </Field>
        </div>
        <Field label="Title">
          <Input name="title" placeholder="Pack title" />
        </Field>
        <Field label="Subtitle">
          <Textarea name="subtitle" />
        </Field>
        <Field label="Promise">
          <Textarea name="promise" />
        </Field>
        <Field label="Description">
          <Textarea name="description" />
        </Field>
        <div className="grid gap-4 md:grid-cols-3">
          <Field label="Price cents">
            <Input name="priceCents" type="number" defaultValue={0} />
          </Field>
          <Field label="Estimated hours">
            <Input name="estimatedHours" type="number" step="0.5" />
          </Field>
          <Field label="Difficulty">
            <Input name="difficultyLevel" />
          </Field>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Field label="Stripe price ID">
            <Input name="stripePriceId" />
          </Field>
          <Field label="Badge">
            <Input name="badge" />
          </Field>
          <Field label="Cover image URL">
            <Input name="coverImageUrl" />
          </Field>
        </div>
        <Field label="Includes" hint="One line per item.">
          <Textarea name="includes" />
        </Field>
        <Field label="Outcomes" hint="One line per item.">
          <Textarea name="outcomes" />
        </Field>
        <Field label="Who it's for" hint="One line per item.">
          <Textarea name="whoItsFor" />
        </Field>
        <Field label="Who it's not for" hint="One line per item.">
          <Textarea name="whoItsNotFor" />
        </Field>
        <Field label="Format breakdown" hint="One line per item using label::value.">
          <Textarea name="formatBreakdown" />
        </Field>
        <Field label="Study fit">
          <Textarea name="studyFit" />
        </Field>
        <Field label="Preview notes" hint="One line per item.">
          <Textarea name="previewNotes" />
        </Field>
        <Field label="FAQ items" hint="One line per item using question::answer.">
          <Textarea name="faqItems" />
        </Field>
        <Field label="Related pack slugs" hint="One line per slug.">
          <Textarea name="relatedPackSlugs" />
        </Field>
        <div className="grid gap-4 md:grid-cols-2">
          <CheckboxField name="isFeatured">Feature this pack publicly.</CheckboxField>
          <CheckboxField name="isActive" defaultChecked>
            Keep this pack visible and sellable.
          </CheckboxField>
        </div>
      </FormShell>

      <SectionHeading
        eyebrow="Free guides"
        title="Lead magnets"
        description="Capture leads by exam and section, then route the follow-on offer cleanly."
      />
      <div className="grid gap-6">
        {guides.map((guide) => (
          <FormShell
            key={guide.id}
            action={upsertGuideAction}
            title={guide.title}
            subtitle={guide.subtitle}
            writable={writable}
            deleteAction={deleteGuideAction}
            deleteId={guide.id}
          >
            <input type="hidden" name="id" value={guide.id} />
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Exam">
                <Select name="examId" defaultValue={exams.find((exam) => exam.slug === guide.examSlug)?.id}>
                  {exams.map((exam) => (
                    <option key={exam.id} value={exam.id}>
                      {exam.name}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Section">
                <Select name="sectionId" defaultValue={sections.find((section) => section.slug === guide.sectionSlug)?.id ?? ""}>
                  <option value="">General</option>
                  {sections.map((section) => (
                    <option key={section.id} value={section.id}>
                      {section.examName} / {section.name}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Slug">
                <Input name="slug" defaultValue={guide.slug} />
              </Field>
              <Field label="Delivery mode">
                <Select name="deliveryMode" defaultValue={guide.deliveryMode}>
                  <option value="download">download</option>
                  <option value="email">email</option>
                  <option value="both">both</option>
                </Select>
              </Field>
            </div>
            <Field label="Title">
              <Input name="title" defaultValue={guide.title} />
            </Field>
            <Field label="Subtitle">
              <Textarea name="subtitle" defaultValue={guide.subtitle} />
            </Field>
            <Field label="Promise">
              <Textarea name="promise" defaultValue={guide.promise} />
            </Field>
            <Field label="Description">
              <Textarea name="description" defaultValue={guide.description} />
            </Field>
            <Field label="Bullets" hint="One line per bullet.">
              <Textarea name="bullets" defaultValue={lines(guide.bullets)} />
            </Field>
            <Field label="Preview cards" hint="One line per preview card.">
              <Textarea name="previewCards" defaultValue={lines(guide.previewCards)} />
            </Field>
            <Field label="File path">
              <Input name="filePath" defaultValue={guide.filePath} />
            </Field>
            <Field label="CTA after submit">
              <Textarea name="ctaAfterSubmit" defaultValue={guide.ctaAfterSubmit} />
            </Field>
            <Field label="Related pack">
              <Select
                name="relatedPackId"
                defaultValue={packs.find((pack) => pack.slug === guide.relatedPackSlug)?.id ?? ""}
              >
                <option value="">No related pack</option>
                {packs.map((pack) => (
                  <option key={pack.id} value={pack.id}>
                    {pack.title}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Privacy reassurance">
              <Textarea
                name="privacyReassurance"
                defaultValue={guide.privacyReassurance}
              />
            </Field>
            <Field label="What happens next" hint="One line per step.">
              <Textarea
                name="whatHappensNext"
                defaultValue={lines(guide.whatHappensNext)}
              />
            </Field>
            <Field label="Thank-you title">
              <Input name="thankYouTitle" defaultValue={guide.thankYouTitle} />
            </Field>
            <Field label="Thank-you body">
              <Textarea name="thankYouBody" defaultValue={guide.thankYouBody} />
            </Field>
            <CheckboxField name="isActive" defaultChecked={guide.isActive}>
              Keep this guide available publicly.
            </CheckboxField>
          </FormShell>
        ))}

        <FormShell
          action={upsertGuideAction}
          title="Add free guide"
          subtitle="Create a new lead magnet and its thank-you flow."
          writable={writable}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Exam">
              <Select name="examId" defaultValue={exams[0]?.id}>
                {exams.map((exam) => (
                  <option key={exam.id} value={exam.id}>
                    {exam.name}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Section">
              <Select name="sectionId" defaultValue="">
                <option value="">General</option>
                {sections.map((section) => (
                  <option key={section.id} value={section.id}>
                    {section.examName} / {section.name}
                  </option>
                ))}
              </Select>
            </Field>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Slug">
              <Input name="slug" placeholder="new-guide" />
            </Field>
            <Field label="Delivery mode">
              <Select name="deliveryMode" defaultValue="both">
                <option value="download">download</option>
                <option value="email">email</option>
                <option value="both">both</option>
              </Select>
            </Field>
          </div>
          <Field label="Title">
            <Input name="title" />
          </Field>
          <Field label="Subtitle">
            <Textarea name="subtitle" />
          </Field>
          <Field label="Promise">
            <Textarea name="promise" />
          </Field>
          <Field label="Description">
            <Textarea name="description" />
          </Field>
          <Field label="Bullets">
            <Textarea name="bullets" />
          </Field>
          <Field label="Preview cards">
            <Textarea name="previewCards" />
          </Field>
          <Field label="File path">
            <Input name="filePath" />
          </Field>
          <Field label="CTA after submit">
            <Textarea name="ctaAfterSubmit" />
          </Field>
          <Field label="Related pack">
            <Select name="relatedPackId" defaultValue="">
              <option value="">No related pack</option>
              {packs.map((pack) => (
                <option key={pack.id} value={pack.id}>
                  {pack.title}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Privacy reassurance">
            <Textarea name="privacyReassurance" />
          </Field>
          <Field label="What happens next">
            <Textarea name="whatHappensNext" />
          </Field>
          <Field label="Thank-you title">
            <Input name="thankYouTitle" />
          </Field>
          <Field label="Thank-you body">
            <Textarea name="thankYouBody" />
          </Field>
          <CheckboxField name="isActive" defaultChecked>
            Keep this guide available publicly.
          </CheckboxField>
        </FormShell>
      </div>

      <SectionHeading
        eyebrow="Offers"
        title="Coupons and promo banners"
        description="Manage merchandising metadata without coupling the public site to Stripe’s dashboard."
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          {coupons.map((coupon) => (
            <FormShell
              key={coupon.id}
              action={upsertCouponAction}
              title={coupon.name}
              subtitle={coupon.code}
              writable={writable}
              deleteAction={deleteCouponAction}
              deleteId={coupon.id}
            >
              <input type="hidden" name="id" value={coupon.id} />
              <Field label="Name">
                <Input name="name" defaultValue={coupon.name} />
              </Field>
              <Field label="Code">
                <Input name="code" defaultValue={coupon.code} />
              </Field>
              <Field label="Stripe promotion code ID">
                <Input
                  name="stripePromotionCodeId"
                  defaultValue={coupon.stripePromotionCodeId}
                />
              </Field>
              <CheckboxField name="active" defaultChecked={coupon.active}>
                Keep this coupon campaign active.
              </CheckboxField>
            </FormShell>
          ))}

          <FormShell
            action={upsertCouponAction}
            title="Add coupon campaign"
            subtitle="Track offer metadata even when Stripe stores the actual discount."
            writable={writable}
          >
            <Field label="Name">
              <Input name="name" />
            </Field>
            <Field label="Code">
              <Input name="code" />
            </Field>
            <Field label="Stripe promotion code ID">
              <Input name="stripePromotionCodeId" />
            </Field>
            <CheckboxField name="active" defaultChecked>
              Keep this coupon campaign active.
            </CheckboxField>
          </FormShell>
        </div>

        <div className="space-y-6">
          {banners.map((banner) => (
            <FormShell
              key={banner.id}
              action={upsertPromoBannerAction}
              title={banner.title}
              subtitle={banner.body}
              writable={writable}
              deleteAction={deletePromoBannerAction}
              deleteId={banner.id}
            >
              <input type="hidden" name="id" value={banner.id} />
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Theme">
                  <Select name="theme" defaultValue={banner.theme}>
                    <option value="neutral">neutral</option>
                    <option value="accent">accent</option>
                  </Select>
                </Field>
                <Field label="Sort order">
                  <Input name="sortOrder" type="number" defaultValue={banner.sortOrder} />
                </Field>
              </div>
              <Field label="Title">
                <Input name="title" defaultValue={banner.title} />
              </Field>
              <Field label="Body">
                <Textarea name="body" defaultValue={banner.body} />
              </Field>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="CTA label">
                  <Input name="ctaLabel" defaultValue={banner.ctaLabel} />
                </Field>
                <Field label="CTA href">
                  <Input name="ctaHref" defaultValue={banner.ctaHref} />
                </Field>
              </div>
              <CheckboxField name="isActive" defaultChecked={banner.isActive}>
                Publish this banner across the marketing surface.
              </CheckboxField>
            </FormShell>
          ))}

          <FormShell
            action={upsertPromoBannerAction}
            title="Add promo banner"
            subtitle="Create a site-wide offer banner for launch, bundle discounts, or seasonal messaging."
            writable={writable}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Theme">
                <Select name="theme" defaultValue="accent">
                  <option value="neutral">neutral</option>
                  <option value="accent">accent</option>
                </Select>
              </Field>
              <Field label="Sort order">
                <Input name="sortOrder" type="number" defaultValue={banners.length + 1} />
              </Field>
            </div>
            <Field label="Title">
              <Input name="title" />
            </Field>
            <Field label="Body">
              <Textarea name="body" />
            </Field>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="CTA label">
                <Input name="ctaLabel" />
              </Field>
              <Field label="CTA href">
                <Input name="ctaHref" />
              </Field>
            </div>
            <CheckboxField name="isActive" defaultChecked>
              Publish this banner across the marketing surface.
            </CheckboxField>
          </FormShell>
        </div>
      </div>
    </div>
  );
}
