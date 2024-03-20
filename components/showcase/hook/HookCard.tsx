"use client";

import { useRef, useState } from "react";

import { useInView } from "react-intersection-observer";

import PreviewCopy, {
  PreviewWebsite,
  PreviewGithub,
  PreviewFolder,
} from "@component/overall/preview/PreviewCopy";
import PreviewCreator from "@component/overall/preview/PreviewCreator";
import PreviewIframe from "@component/overall/preview/PreviewIframe";
import PreviewTitle from "@component/overall/preview/PreviewTitle";
import { HookType } from "@/types/hook";

export default function ComponentPreview({
  componentData,
}: {
  componentData: HookType;
}) {
  const refIframe = useRef(null);

  const [previewWidth, setPreviewWidth] = useState("100%");
  const [showPreview, setShowPreview] = useState(true);

  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: true,
  });

  const {
    id: componentId,
    title: componentTitle,
    description: componentDescription,
    website: componentWebsite,
    creatorName: componentCreator,
  } = componentData;

  return (
    <div ref={ref} id={componentId.toString()} className="max-w-md p-2">
      <div className="space-y-2">
        <PreviewTitle
          componentTitle={componentTitle}
          componentId={componentId.toString()}
        />

        <div className="flex flex-wrap items-end justify-between">
          <div className="flex gap-2">
            <PreviewCopy
              componentCode={componentTitle + "\n" + componentDescription}
            />
            {componentWebsite && <PreviewGithub repoUrl={componentWebsite} />}
          </div>
          <div>
            <PreviewFolder url={`/hooks/hook/${componentId}`} />
          </div>
        </div>

        <div className="relative">
          <div>
            <PreviewIframe
              showPreview={showPreview}
              componentId={componentId.toString()}
              componentTitle={componentTitle}
              componentDescription={componentDescription}
              componentCreator={componentCreator}
              previewWidth={previewWidth}
              refIframe={refIframe}
              componentHtml={""}
              previewDark={false}
            />
          </div>
        </div>

        {componentCreator && (
          <PreviewCreator creatorGithub={componentCreator} />
        )}
      </div>
    </div>
  );
}
