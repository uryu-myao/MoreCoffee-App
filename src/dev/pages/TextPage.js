import Text from '../../components/base/Text';
import { HarnessCase, HarnessGroup, HarnessPage } from '../harness';
import { SAMPLE } from '../samples';

export default function TextPage() {
  return (
    <HarnessPage>
      <HarnessGroup title="truncate=name · title · 2 lines">
        <HarnessCase label="short" framed>
          <Text variant="title" truncate="name">{SAMPLE.name.short}</Text>
        </HarnessCase>
        <HarnessCase label="long · en" framed>
          <Text variant="title" truncate="name">{SAMPLE.name.en}</Text>
        </HarnessCase>
        <HarnessCase label="long · ja" framed>
          <Text variant="title" truncate="name">{SAMPLE.name.ja}</Text>
        </HarnessCase>
        <HarnessCase label="long · zh" framed>
          <Text variant="title" truncate="name">{SAMPLE.name.zh}</Text>
        </HarnessCase>
      </HarnessGroup>

      <HarnessGroup title="truncate=meta · bodySm · 1 line">
        <HarnessCase label="short" framed>
          <Text variant="bodySm" color="muted" truncate="meta">{SAMPLE.meta.short}</Text>
        </HarnessCase>
        <HarnessCase label="long · en" framed>
          <Text variant="bodySm" color="muted" truncate="meta">{SAMPLE.meta.en}</Text>
        </HarnessCase>
        <HarnessCase label="long · ja" framed>
          <Text variant="bodySm" color="muted" truncate="meta">{SAMPLE.meta.ja}</Text>
        </HarnessCase>
      </HarnessGroup>

      <HarnessGroup title="truncate=note · body · 3 lines">
        <HarnessCase label="long · en" framed>
          <Text variant="body" color="muted" truncate="note">{SAMPLE.note.en}</Text>
        </HarnessCase>
        <HarnessCase label="long · ja (kinsoku: no line-leading 。、」)" framed>
          <Text variant="body" color="muted" truncate="note">{SAMPLE.note.ja}</Text>
        </HarnessCase>
        <HarnessCase label="long · zh" framed>
          <Text variant="body" color="muted" truncate="note">{SAMPLE.note.zh}</Text>
        </HarnessCase>
      </HarnessGroup>

      <HarnessGroup title="truncate=none · detail screen">
        <HarnessCase label="long · ja · full text" framed>
          <Text variant="body" color="muted">{SAMPLE.note.ja}</Text>
        </HarnessCase>
      </HarnessGroup>

      <HarnessGroup title="colour">
        <HarnessCase label="color.text keys">
          <Text variant="label">primary</Text>
          <Text variant="label" color="secondary">secondary</Text>
          <Text variant="label" color="muted">muted</Text>
          <Text variant="label" color="accent">accent</Text>
          <Text variant="label" color="accentStrong">accentStrong</Text>
          <Text variant="label" color="success">success</Text>
          <Text variant="inlineAction">inlineAction · primary</Text>
        </HarnessCase>
      </HarnessGroup>
    </HarnessPage>
  );
}
