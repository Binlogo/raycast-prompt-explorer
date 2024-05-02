import React from "react";
import NextLink from "next/link";
import SelectionArea, { SelectionEvent } from "@viselect/react";
import { useRouter } from "next/router";
import copy from "copy-to-clipboard";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "../components/Dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "../components/DropdownMenu";
import { Toast, ToastTitle } from "../components/Toast";
import { ScrollArea } from "../components/ScrollArea";
import { Button } from "../components/Button";
import { ButtonGroup } from "../components/ButtonGroup";
import * as Collapsible from "@radix-ui/react-collapsible";
import { isTouchDevice } from "../utils/isTouchDevice";

import { Category, Model, Prompt } from "../data/prompts";

// Notes: temp import the categories in Chinese for now
import { categories } from "../data/prompts-category-cn";

import styles from "../styles/Home.module.css";
import { Instructions } from "../components/Instructions";
import { useSectionInView } from "../utils/useSectionInViewObserver";
import { extractPrompts } from "../utils/extractPrompts";
import CreativityIcon from "../components/CreativityIcon";
import * as ContextMenu from "@radix-ui/react-context-menu";
import {
  ChevronDownIcon,
  CopyClipboardIcon,
  DownloadIcon,
  LinkIcon,
  MinusCircleIcon,
  PlusCircleIcon,
  RaycastLogoNegIcon,
  StarsIcon,
  TrashIcon,
} from "@raycast/icons";
import {
  addToRaycast,
  copyData,
  downloadData,
  makeUrl,
} from "../utils/actions";

const promptModel: Record<Model, string[]> = {
  "openai-gpt-3.5-turbo-instruct": [
    "GPT-3.5 Instruct",
    "OpenAI GPT-3.5 Turbo Instruct",
  ],
  "openai-gpt-3.5-turbo": ["GPT-3.5 Turbo", "OpenAI GPT-3.5 Turbo"],
  "openai-gpt-4": ["GPT-4", "OpenAI GPT-4"],
  "openai-gpt-4-turbo": ["GPT-4 Turbo", "OpenAI GPT-4 Turbo"],
  "anthropic-claude-haiku": ["Claude Haiku", "Anthropic Claude Haiku"],
  "anthropic-claude-opus": ["Claude Opus", "Anthropic Claude Opus"],
  "anthropic-claude-sonnet": ["Claude Sonnet", "Anthropic Claude Sonnet"],
  "perplexity-sonar-medium-online": [
    "Sonar Medium",
    "Perplexity Sonar Medium Online",
  ],
  "perplexity-sonar-small-online": [
    "Sonar Small",
    "Perplexity Sonar Small Online",
  ],
  "llama2-70b": ["Llama2", "Llama2 70B"],
  "mixtral-8x7b": ["Mixtral", "Mixtral 8x7B"],
  "codellama-70b-instruct": ["CodeLlama Instruct", "CodeLlama 70B Instruct"],
};

export function getStaticPaths() {
  const paths = categories.map((category) => ({
    params: { slug: [category.slug.replace("/", "")] },
  }));

  return {
    paths: [
      ...paths,
      {
        params: { slug: [] },
      },
    ],
    fallback: false,
  };
}

export async function getStaticProps() {
  return {
    props: {},
  };
}

export default function Home({ onTouchReady }: { onTouchReady: () => void }) {
  const router = useRouter();

  const [selectedPrompts, setSelectedPrompts] = React.useState<Prompt[]>([]);

  const [showToast, setShowToast] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState("");

  const [actionsOpen, setActionsOpen] = React.useState(false);
  const [aboutOpen, setAboutOpen] = React.useState(false);
  const [isTouch, setIsTouch] = React.useState<boolean>();

  const onStart = ({ event, selection }: SelectionEvent) => {
    if (!isTouch && !event?.ctrlKey && !event?.metaKey) {
      selection.clearSelection();
      setSelectedPrompts([]);
    }
  };

  const onMove = ({
    store: {
      changed: { added, removed },
    },
  }: SelectionEvent) => {
    const addedPrompts = extractPrompts(added, categories);
    const removedPrompts = extractPrompts(removed, categories);

    setSelectedPrompts((prevPrompts) => {
      const prompts = [...prevPrompts];

      addedPrompts.forEach((prompt) => {
        if (!prompt) {
          return;
        }
        if (prompts.find((p) => p.id === prompt.id)) {
          return;
        }
        prompts.push(prompt);
      });

      removedPrompts.forEach((prompt) => {
        return prompts.filter((s) => s?.id !== prompt?.id);
      });

      return prompts;
    });
  };

  const handleDownload = React.useCallback(() => {
    downloadData(selectedPrompts);
  }, [selectedPrompts]);

  const handleCopyData = React.useCallback(() => {
    copyData(selectedPrompts);
    setToastMessage("Copied to clipboard");
    setShowToast(true);
  }, [selectedPrompts]);

  const handleCopyUrl = React.useCallback(async () => {
    setToastMessage("Copying URL to clipboard...");
    setShowToast(true);

    const url = makeUrl(selectedPrompts);
    let urlToCopy = url;
    const encodedUrl = encodeURIComponent(urlToCopy);
    const response = await fetch(
      `https://ray.so/api/shorten-url?url=${encodedUrl}&ref=prompts`
    ).then((res) => res.json());

    if (response.link) {
      urlToCopy = response.link;
    }

    copy(urlToCopy);
    setShowToast(true);
    setToastMessage("Copied URL to clipboard!");
  }, [selectedPrompts]);

  const handleCopyText = React.useCallback((prompt: Prompt) => {
    copy(prompt.prompt);
    setShowToast(true);
    setToastMessage("Copied to clipboard");
  }, []);

  const handleAddToRaycast = React.useCallback(
    () => addToRaycast(router, selectedPrompts),
    [router, selectedPrompts]
  );

  React.useEffect(() => {
    setIsTouch(isTouchDevice());
    onTouchReady();
  }, [isTouch, setIsTouch, onTouchReady]);

  React.useEffect(() => {
    const down = (event: KeyboardEvent) => {
      const { key, keyCode, metaKey, shiftKey, altKey } = event;

      if (key === "k" && metaKey) {
        if (selectedPrompts.length === 0) return;
        setActionsOpen((prevOpen) => {
          return !prevOpen;
        });
      }

      if (key === "d" && metaKey) {
        if (selectedPrompts.length === 0) return;
        event.preventDefault();
        handleDownload();
      }

      if (key === "Enter" && metaKey) {
        if (selectedPrompts.length === 0) return;
        event.preventDefault();
        handleAddToRaycast();
      }

      // key === "c" doesn't work when using alt key, so we use keCode instead (67)
      if (keyCode === 67 && metaKey && altKey) {
        if (selectedPrompts.length === 0) return;
        event.preventDefault();
        handleCopyData();
        setActionsOpen(false);
      }

      if (key === "c" && metaKey && shiftKey) {
        event.preventDefault();
        handleCopyUrl();
        setActionsOpen(false);
      }

      if (key === "/" && metaKey) {
        event.preventDefault();
        setActionsOpen(false);
        setAboutOpen((prevOpen) => !prevOpen);
      }

      if (key === "a" && metaKey) {
        event.preventDefault();
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [
    setActionsOpen,
    setAboutOpen,
    selectedPrompts,
    handleCopyData,
    handleDownload,
    handleCopyUrl,
    handleAddToRaycast,
  ]);

  React.useEffect(() => {
    if (showToast) {
      setTimeout(() => {
        setShowToast(false);
      }, 2000);
    }
  }, [showToast]);
  return (
    <div>
      <header className={styles.nav}>
        <Dialog open={aboutOpen} onOpenChange={setAboutOpen}>
          <DialogTrigger asChild>
            <button className={styles.logo}>
              <RaycastLogoNegIcon />
              <div className={styles.logoSeparator} aria-hidden="true"></div>
              <h2>Prompt Explorer</h2>
            </button>
          </DialogTrigger>
          <DialogContent className={styles.about} showCloseButton={true}>
            <div className={styles.aboutTopContent}>
              <div>
                <DialogTitle className={styles.dialogTitle}>关于</DialogTitle>
                <DialogDescription className={styles.dialogDescription}>
                  Prompt Explorer 是一个方便浏览、分享和添加提示到{" "}
                  <a href="https://raycast.com">Raycast</a> 的工具。
                </DialogDescription>
                <p className={styles.dialogDescription}>
                  通过点击提示来选择它们。要选择多个提示，按住 <kbd>⌘</kbd>{" "}
                  键或使用鼠标选择。
                </p>
                <p className={styles.dialogDescription}>
                  然后，点击“添加到 Raycast”按钮将这些提示作为 AI
                  命令导入。您还可以将提示下载为 JSON 文件，或复制 URL
                  与他人分享。
                </p>
              </div>
              {!isTouch && (
                <div>
                  <h4 className={styles.dialogTitle}>快捷键</h4>
                  <ul className={styles.shortcuts}>
                    <li>
                      添加到 Raycast
                      <span className={styles.hotkeys}>
                        <kbd>⌘</kbd>
                        <kbd>⏎</kbd>
                      </span>
                    </li>
                    <li>
                      切换导出菜单
                      <span className={styles.hotkeys}>
                        <kbd>⌘</kbd>
                        <kbd>K</kbd>
                      </span>
                    </li>
                    <li>
                      下载 JSON
                      <span className={styles.hotkeys}>
                        <kbd>⌘</kbd>
                        <kbd>D</kbd>
                      </span>
                    </li>
                    <li>
                      复制 JSON
                      <span className={styles.hotkeys}>
                        <kbd>⌘</kbd>
                        <kbd>⌥</kbd>
                        <kbd>C</kbd>
                      </span>
                    </li>
                    <li>
                      复制分享链接
                      <span className={styles.hotkeys}>
                        <kbd>⌘</kbd>
                        <kbd>⇧</kbd>
                        <kbd>C</kbd>
                      </span>
                    </li>
                    <li>
                      切换视图
                      <span className={styles.hotkeys}>
                        <kbd>⌘</kbd>
                        <kbd>/</kbd>
                      </span>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            <h4 className={styles.dialogTitle}>贡献</h4>
            <p className={styles.dialogDescription}>
              该项目是开源的，{" "}
              <a
                href="https://github.com/raycast/prompt-explorer"
                title="在 GitHub 上的 Prompt Explorer"
              >
                在 GitHub 上可用
              </a>
              。我们欢迎贡献！
              <br />
              如果您有任何问题或反馈，请{" "}
              <a href="mailto:feedback+rayso@raycast.com?subject=prompts">
                发送电子邮件给我们
              </a>
              。
            </p>

            <p style={{ fontSize: 13, marginTop: 32 }}>
              <a
                href="https://raycast.com"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                }}
              >
                由{" "}
                <span style={{ color: "#FF6363" }}>
                  <RaycastLogoNegIcon />{" "}
                </span>
                <span>Raycast</span>
                制作 · 中文版由<a href="https://github.com/Binlogo"><span style={{ color: "#FF6363" }}>Binlogo</span></a>贡献
              </a>
            </p>
            <div className={styles.aboutGlow} />
          </DialogContent>
        </Dialog>

        <div className={styles.navControls}>
          {!isTouch ? (
            <ButtonGroup>
              <Button
                variant="red"
                disabled={selectedPrompts.length === 0}
                onClick={() => handleAddToRaycast()}
              >
                <PlusCircleIcon /> 添加到 Raycast
              </Button>

              <DropdownMenu open={actionsOpen} onOpenChange={setActionsOpen}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="red"
                    disabled={selectedPrompts.length === 0}
                    aria-label="导出选项"
                  >
                    <ChevronDownIcon />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    disabled={selectedPrompts.length === 0}
                    onSelect={() => handleDownload()}
                  >
                    <DownloadIcon /> 下载 JSON
                    <span className={styles.hotkeys}>
                      <kbd>⌘</kbd>
                      <kbd>D</kbd>
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    disabled={selectedPrompts.length === 0}
                    onSelect={() => handleCopyData()}
                  >
                    <CopyClipboardIcon /> 复制 JSON{" "}
                    <span className={styles.hotkeys}>
                      <kbd>⌘</kbd>
                      <kbd>⌥</kbd>
                      <kbd>C</kbd>
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    disabled={selectedPrompts.length === 0}
                    onSelect={() => handleCopyUrl()}
                  >
                    <LinkIcon /> 复制分享链接{" "}
                    <span className={styles.hotkeys}>
                      <kbd>⌘</kbd>
                      <kbd>⇧</kbd>
                      <kbd>C</kbd>
                    </span>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />
                </DropdownMenuContent>
              </DropdownMenu>
            </ButtonGroup>
          ) : (
            <Button
              variant="red"
              disabled={selectedPrompts.length === 0}
              onClick={() => handleCopyUrl()}
            >
              <LinkIcon /> 复制分享链接
            </Button>
          )}
        </div>
      </header>

      <Toast open={showToast} onOpenChange={setShowToast}>
        <ToastTitle className={styles.toastTitle}>
          <CopyClipboardIcon /> {toastMessage}
        </ToastTitle>
      </Toast>

      <div className={styles.main}>
        <div className={styles.sidebar}>
          <div className={styles.sidebarInner}>
            <ScrollArea>
              <div className={styles.sidebarContent}>
                <div className={styles.sidebarNav}>
                  <p className={styles.sidebarTitle}>分类</p>

                  {categories.map((category) => (
                    <NavItem key={category.slug} category={category} />
                  ))}
                </div>

                {selectedPrompts.length === 0 && <Instructions />}

                {selectedPrompts.length > 0 && (
                  <div>
                    <p className={styles.sidebarTitle}>添加到 Raycast</p>

                    <Collapsible.Root>
                      <Collapsible.Trigger asChild>
                        <button className={styles.summaryTrigger}>
                          {selectedPrompts.length}{" "}
                          {selectedPrompts.length > 1 ? "个提示" : "个提示"}{" "}
                          已选择
                          <ChevronDownIcon />
                        </button>
                      </Collapsible.Trigger>

                      <Collapsible.Content className={styles.summaryContent}>
                        {selectedPrompts.map((prompt, index) => (
                          <div
                            key={prompt.title + index}
                            className={styles.summaryItem}
                          >
                            {prompt.title}
                            <button
                              className={styles.summaryItemButton}
                              onClick={() => {
                                setSelectedPrompts(
                                  selectedPrompts.filter(
                                    (selectedPrompt) =>
                                      selectedPrompt.id !== prompt.id
                                  )
                                );
                              }}
                            >
                              <TrashIcon />
                            </button>
                          </div>
                        ))}
                      </Collapsible.Content>
                    </Collapsible.Root>

                    <div className={styles.summaryControls}>
                      <Button onClick={handleAddToRaycast} variant="red">
                        添加到 Raycast
                      </Button>

                      <Button onClick={() => setSelectedPrompts([])}>
                        清除选择
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>

        <div className={styles.container}>
          {isTouch !== null && (
            <SelectionArea
              className="container"
              onStart={onStart}
              onMove={onMove}
              selectables=".selectable"
              features={{
                // Disable support for touch devices
                touch: isTouch ? false : true,
                range: true,
                singleTap: {
                  allow: true,
                  intersect: "native",
                },
              }}
            >
              {categories.map((category) => {
                return (
                  <div
                    key={category.name}
                    data-section-slug={category.slug}
                    style={{
                      outline: "none",
                    }}
                    tabIndex={-1}
                  >
                    <h2 className={styles.subtitle}>
                      <category.iconComponent /> {category.name}
                    </h2>
                    <div className={styles.prompts}>
                      {category.prompts.map((prompt, index) => {
                        const isSelected = selectedPrompts.some(
                          (selectedPrompt) => selectedPrompt.id === prompt.id
                        );
                        return (
                          <ContextMenu.Root key={prompt.id}>
                            <ContextMenu.Trigger>
                              <div
                                className={`${styles.item} selectable`}
                                data-selected={isSelected}
                                data-key={`${category.slug}-${index}`}
                              >
                                <div className={styles.promptTemplate}>
                                  <ScrollArea>
                                    <pre
                                      className={styles.template}
                                      dangerouslySetInnerHTML={{
                                        __html: prompt.prompt.replace(
                                          /\{[^}]+\}/g,
                                          `<span class="${styles.placeholder}">$&</span>`
                                        ),
                                      }}
                                    ></pre>
                                  </ScrollArea>
                                </div>
                                <div className={styles.prompt}>
                                  <span className={styles.name}>
                                    <prompt.iconComponent />
                                    {prompt.title}
                                    {prompt.author ? (
                                      <span className={styles.promptAuthor}>
                                        作者{" "}
                                        {prompt.author.link ? (
                                          <a
                                            href={prompt.author.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                          >
                                            {prompt.author.name}
                                          </a>
                                        ) : (
                                          prompt.author.name
                                        )}
                                      </span>
                                    ) : null}
                                  </span>
                                  {prompt.model ? (
                                    <span
                                      className={styles.promptModel}
                                      title={promptModel[prompt.model][1]}
                                    >
                                      {promptModel[prompt.model][0]}
                                    </span>
                                  ) : null}
                                  <CreativityIcon
                                    creativity={prompt.creativity}
                                  />
                                </div>
                              </div>
                            </ContextMenu.Trigger>
                            <ContextMenu.Portal>
                              <ContextMenu.Content
                                className={styles.contextMenuContent}
                              >
                                <ContextMenu.Item
                                  className={styles.contextMenuItem}
                                  onSelect={() => {
                                    if (isSelected) {
                                      return setSelectedPrompts((prevPrompts) =>
                                        prevPrompts.filter(
                                          (prevPrompt) =>
                                            prevPrompt.id !== prompt.id
                                        )
                                      );
                                    }
                                    setSelectedPrompts((prevPrompts) => [
                                      ...prevPrompts,
                                      prompt,
                                    ]);
                                  }}
                                >
                                  {isSelected ? (
                                    <MinusCircleIcon />
                                  ) : (
                                    <PlusCircleIcon />
                                  )}
                                  {isSelected ? "取消选择提示" : "选择提示"}
                                </ContextMenu.Item>
                                <ContextMenu.Item
                                  className={styles.contextMenuItem}
                                  onSelect={() => handleCopyText(prompt)}
                                >
                                  <CopyClipboardIcon /> 复制提示文本{" "}
                                </ContextMenu.Item>
                              </ContextMenu.Content>
                            </ContextMenu.Portal>
                          </ContextMenu.Root>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </SelectionArea>
          )}
        </div>
      </div>
    </div>
  );
}

function NavItem({ category }: { category: Category }) {
  const activeSection = useSectionInView();

  return (
    <NextLink
      href={category.slug}
      shallow
      className={styles.sidebarNavItem}
      data-active={activeSection === category.slug}
    >
      {category.icon ? <category.iconComponent /> : <StarsIcon />}

      {category.name}
      <span className={styles.badge}>{category.prompts.length}</span>
    </NextLink>
  );
}
