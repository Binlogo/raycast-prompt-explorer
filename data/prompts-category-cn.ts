import { IconName, Icons } from "@raycast/icons";
import { SVGProps } from "react";
import { Prompt } from "./prompts";

function generateSelection(selectionWord: string, resultWord: string) {
  return `\n\n${selectionWord}: {selection}\n\n${resultWord}:`;
}

const browser: Prompt[] = [
  {
    id: "inspect-website-cn",
    title: "查看网站技术栈",
    prompt: `根据以下HTML文档描述使用的技术栈:

{browser-tab format="html"}

考虑技术堆栈的每个元素，从框架到API再到工具（分析、监控等）。包括使用了哪些字体。如果没有证据，不要猜测使用了什么`,
    creativity: "low",
    date: "2024-03-18",
    icon: "globe-01",
    model: "anthropic-claude-haiku",
  },
  {
    id: "summarize-youtube-video-cn",
    title: "总结 YouTube 视频",
    prompt: `使用视频的转录稿件创建YouTube视频总结摘要。使用以下模板:

"""
## 总结
{Multiple sentences summarising the YouTube video}

## 摘要
{Bullet points that summarize the key points or important moments from the video’s transcript with explanations}

## 引用
{Extract the best sentences from the transcript in a list}
"""

转录稿件: {browser-tab}`,
    creativity: "low",
    model: "anthropic-claude-haiku",
    date: "2024-03-18",
    icon: "play-filled",
  },
];

const code: Prompt[] = [
  {
    id: "css-to-tailwind-cn",
    title: "将CSS代码转换为Tailwind CSS类",
    prompt:
      "将以下代码转换为Tailwind CSS类，并在代码块中给出结果。确保删除任何浏览器前缀。只给出我可以放入HTML元素'class'属性中的内容。" +
      generateSelection("Code", "Tailwind CSS classes"),
    creativity: "low",
    model: "openai-gpt-3.5-turbo",
    date: "2024-05-01",
    icon: "code",
  },
  {
    id: "add-debug-statements-cn",
    title: "添加调试语句",
    prompt:
      "扮演软件工程师调试其代码。向代码中添加调试语句。根据需要添加尽可能多的语句，以便更轻松地进行调试。" +
      generateSelection("Code", "Debugged code"),
    creativity: "medium",
    model: "openai-gpt-3.5-turbo",
    date: "2024-05-01",
    icon: "bug",
  },
  {
    id: "write-docstring-cn",
    title: "编写函数文档",
    prompt:
      "为函数添加说明文档。保证文档尽量详尽。" +
      generateSelection("Function", "Docstring"),
    creativity: "low",
    model: "openai-gpt-3.5-turbo",
    date: "2024-05-01",
    icon: "blank-document",
  },
];

const communication: Prompt[] = [
  {
    id: "translate-to-chinese",
    title: "翻译为中文",
    prompt: "将文本翻译为中文。" + generateSelection("文本", "翻译"),
    creativity: "low",
    date: "2024-05-01",
    icon: "speech-bubble",
  },
  {
    id: "translate-to-language-cn",
    title: "翻译为指定语言",
    prompt:
      "将文本翻译为 {argument name=language}." +
      generateSelection("文本", "翻译"),
    creativity: "low",
    date: "2024-05-01",
    icon: "speech-bubble",
  },
  {
    id: "ask-question-cn",
    title: "友好提问",
    prompt:
      "用简洁友好的语气改写以下文本提问，这个问题应该可以在类似Slack这样的聊天应用中发送。" +
      generateSelection("Text", "Question"),
    creativity: "low",
    date: "2024-05-01",
    icon: "question-mark-circle",
  },
  {
    id: "ask-question-en-cn",
    title: "友好提问 - 使用英语",
    prompt:
      "用简洁友好的语气并使使用英语改写以下文本提问，这个问题应该可以在类似Slack、Discord这样的聊天应用中发送。" +
      generateSelection("Text", "Question"),
    creativity: "low",
    date: "2024-05-01",
    icon: "question-mark-circle",
  },
];

const image: Prompt[] = [
  {
    id: "youtube-script-cn",
    title: "创建 YouTube 脚本",
    prompt:
      "创建一个基于这段文本的引人入胜和吸引人的YouTube脚本。确保在脚本中包含B-Rolls。该脚本需要支持制作时长为 {argument name=分钟 default=10} 分钟的视频." +
      generateSelection("文本", "脚本"),
    creativity: "high",
    date: "2024-05-01",
    icon: "image",
  },
  {
    id: "midjourney-prompt-generator-cn",
    title: "Midjourney 提示词生成器",
    prompt:
      `基于这段文本，生成一个包含最多1500个字的“想象提示词”，该提示词将作为输入用于名为MidJourney的基于AI的文本到图像程序，根据以下参数生成：/imagine prompt: [1], [2], [3], [4], [5], [6]

在这个提示词中，[1] 应该被一个随机的主题替换，[2] 应该是关于该主题的简短而简洁的描述。在描述中使用具体的形容词和副词，广泛使用词汇和感官语言。提供关于主题的背景和上下文信息，并考虑图像的视角和观点。适度使用比喻和拟人手法，以更具体和生动的方式描述抽象或复杂的概念。使用具体的名词和积极的动词使描述更具体和动态。

[3] 应该是关于场景环境的简短而简洁的描述。考虑图像的整体色调和氛围，使用能唤起所需情感和氛围的语言。使用具体的细节和形容词来生动地描述场景。

[4] 应该是关于场景情绪的简短而简洁的描述。使用能传达所需情感和氛围的语言，并考虑图像的整体色调和氛围。

[5] 应该是关于场景氛围的简短而简洁的描述。使用形容词和副词来创造一个考虑图像的整体色调和氛围的氛围感。

[6] 应该是关于光照效果的简短而简洁的描述，包括光源类型、显示类型、光照风格和技术、全局照明和阴影。描述光线的质量、方向、颜色和强度，并考虑它如何影响场景的情绪和氛围。使用具体的形容词和副词来传达所需的光照效果，考虑光线如何与主题和环境互动。

重要的是要注意，提示词中的描述应该连续写在一起，用逗号和空格分隔，不要包含任何换行符或冒号。不要在括号中包含任何单词、短语或数字，并且您应该始终以“/imagine prompt: ”开头。

在使用语法时要保持一致，避免使用陈词滥调或不必要的词语。确保避免重复使用相同的形容词和副词。适度使用否定描述，并尽量描述您想要的内容，而不是您不想要的内容。适度使用比喻语言，并确保在提示的上下文中它是合适和有效的。在描述中结合各种不常用和常用的词汇。

“想象提示词”严格限制在1500个字以内。在提示的末尾添加后缀“--c X --s Y --q 2”，其中X是1到25之间的整数，Y是100到1000之间的整数，如果提示主题在垂直方向上看起来更好，则在“--c”之前添加“--ar 2:3”，如果提示主题在水平方向上看起来更好，则在“--c”之前添加“--ar 3:2”。请随机化结束参数格式的值，并固定--q 2。请不要使用双引号或标点符号。请使用随机化的结束后缀格式。` +
      generateSelection("文本", "Midjourney 提示词"),
    creativity: "high",
    date: "2024-05-01",
    icon: "image",
  },
];

const writing: Prompt[] = [
  {
    id: "write-story-cn",
    title: "写故事",
    prompt:
    "根据文本编写一个故事。使故事引人入胜。故事的字数不应超过 {argument name=number default=500} 个字。" + 
      generateSelection("文本", "故事"),
    creativity: "high",
    date: "2024-05-01",
    icon: "pencil",
  },
  {
    id: "blog-post-cn",
    title: "撰写博客文章",
    prompt:
      "根据主题撰写一篇博客文章。文章字数不应超过 {argument name=number default=1000} 个字。" +
      generateSelection("主题", "博客文章"),
    creativity: "high",
    date: "2024-05-01",
    icon: "pencil",
  },
  {
    id: "twitter-thread-cn",
    title: "Twitter 话题",
    prompt:
      "将文本转换为一系列推文（Twitter Thread）。第一条推文应该清晰而引人入胜。每条推文应该流畅地过渡到下一条，建立起期待和动力。最后一条推文应该有冲击力，让用户能够对整个线索进行思考。确保每条推文不超过 280 个字符。不要在任何推文中添加单个标签。" +
      generateSelection("文本", "推文"),
    creativity: "medium",
    date: "2024-05-01",
    icon: "bird",
  },
];

const music: Prompt[] = [
  {
    id: "write-a-song-cn",
    title: "写一首歌",
    prompt:
      "根据给定的文本写一首歌。这首歌应该有明确的旋律，歌词讲述一个故事，并有一个令人难忘的副歌。这首歌的情绪应该是{argument name=mood}。" +
      generateSelection("文本", "歌曲"),
    creativity: "high",
    date: "2024-05-01",
    icon: "music",
  },
  {
    id: "playlist-maker-cn",
    title: "制作播放列表",
    prompt:
      "扮演一位歌曲推荐者。根据给定的歌曲，创建一个包含10首类似歌曲的播放列表。为播放列表提供一个名称和描述。不要选择与原歌曲相同的歌曲或艺术家。不要在播放列表中包含原歌曲。" +
      generateSelection("歌曲", "播放列表"),
    creativity: "high",
    date: "2024-05-01",
    icon: "music",
  },
];

const ideas: Prompt[] = [
  {
    id: "write-alternatives-cn",
    title: "头脑风暴：写 10 个替代版本",
    prompt:
      "给我 10 个文本的替代版本。确保这些替代版本彼此之间都是不同的。" +
      generateSelection("文本", "替代版本"),
    creativity: "high",
    date: "2024-05-01",
    icon: "shuffle",
  },
  {
    id: "project-ideas-cn",
    title: "头脑风暴：项目创意",
    prompt:
      "根据文本，构思 5 个项目创意。确保这些创意彼此之间都是不同的。" +
      generateSelection("文本", "创意"),
    creativity: "high",
    date: "2024-05-01",
    icon: "shuffle",
    author: {
      name: "Stephen Kaplan",
      link: "https://github.com/SKaplanOfficial",
    },
  },
  {
    id: "create-analogies-cn",
    title: "头脑风暴：创建类比",
    prompt:
      "开发 {argument name=number default=3} 个有创意的类比或隐喻，帮助解释文本的主要观点。" +
      generateSelection("文本", "类比"),
    creativity: "high",
    date: "2024-05-01",
    icon: "light-bulb",
  },
];

const fun: Prompt[] = [
  {
    id: "act-as-a-character-cn",
    title: "扮演角色",
    prompt:
      "将文本重写，你将扮演的角色是{argument name=character default=yoda}。使用{argument name=character default=yoda}的语气、方式和词汇。你必须了解{argument name=character default=yoda}的所有知识。" +
      generateSelection("文本", "重写后的文本"),
    creativity: "medium",
    date: "2024-05-01",
    icon: "person",
  },
];

const misc: Prompt[] = [
  {
    id: "tldr-cn",
    title: "概要总结(TL;DR)",
    prompt:
      "从文本中提取所有事实，并以最多七个要点和一句总结的方式概括所有相关方面。为每个要点选择一个合适的表情符号。" +
      generateSelection("文本", "概要"),
    creativity: "low",
    date: "2024-05-01",
    icon: "bullet-points",
  },
  {
    id: "title-case-cn",
    title: "标题格式",
    prompt: "将{selection}转换为标题格式。",
    creativity: "low",
    date: "2024-05-01",
    icon: "text",
  },
  {
    id: "emoji-suggestion-cn",
    title: "表情符号建议",
    prompt:
      "为文本提供与之相关的表情符号建议。建议大约10个表情符号，并按相关性排序。不要添加重复的表情符号。只回复表情符号。" +
      generateSelection("文本", "表情符号"),
    creativity: "medium",
    date: "2024-05-01",
    icon: "emoji",
  },
  {
    id: "find-synonyms-cn",
    title: "查找同义词",
    prompt:
      "查找{selection}的同义词，并将输出格式化为列表。单词应存在。不要写任何解释。列表中不应包含原始单词的副本。列表中不应有重复的单词。",
    creativity: "medium",
    date: "2024-05-01",
    icon: "text",
  },
  {
    id: "create-recipe-cn",
    title: "给我一个食谱",
    prompt:
      "根据食材给我一个易于操作的食谱。" +
      generateSelection("食材", "食谱"),
    creativity: "medium",
    date: "2024-05-01",
    icon: "bullet-points",
  },
  {
    id: "create-action-items-cn",
    title: "创建行动项",
    prompt:
      "根据文本生成一个Markdown格式的行动项列表，为每个项目使用唯一标识符作为粗体标题。如果文本中有任何错误，请创建修复错误的行动项。在每个项目的子列表中，提供描述、优先级、难度估计和任务的合理持续时间。" +
      generateSelection("文本", "行动项"),
    creativity: "medium",
    date: "2024-05-01",
    icon: "check-circle",
    author: {
      name: "Stephen Kaplan",
      link: "https://github.com/SKaplanOfficial",
    },
  },
  {
    id: "extract-email-addresses-cn",
    title: "提取电子邮件地址",
    prompt:
      "从文本中提取所有电子邮件地址，并使用Markdown格式列出它们。包括任何可能是电子邮件地址的内容。如果可能，请提供电子邮件地址所属的人或公司的名称。" +
      generateSelection("文本", "电子邮件地址"),
    creativity: "low",
    date: "2024-05-01",
    icon: "envelope",
    author: {
      name: "Stephen Kaplan",
      link: "https://github.com/SKaplanOfficial",
    },
  },
  {
    id: "extract-phone-numbers-cn",
    title: "提取电话号码",
    prompt:
      "识别文本中的所有电话号码，并使用Markdown格式列出它们。包括任何可能是电话号码的内容。如果可能，请提供电话号码所属的人或公司的名称。" +
      generateSelection("文本", "电话号码"),
    creativity: "low",
    date: "2024-05-01",
    icon: "phone",
    author: {
      name: "Stephen Kaplan",
      link: "https://github.com/SKaplanOfficial",
    },
  },
  {
    id: "extract-links-cn",
    title: "提取链接",
    prompt:
      "提取文本中的链接。除了Markdown链接列表之外，不要提供任何评论。" +
      generateSelection("文本", "链接"),
    creativity: "low",
    date: "2024-05-01",
    icon: "link",
    author: {
      name: "Stephen Kaplan",
      link: "https://github.com/SKaplanOfficial",
    },
  },
  {
    id: "pros-and-cons-cn",
    title: "优点和缺点",
    prompt:
      "根据提到的主题，列出文本的优点和缺点。将响应格式化为Markdown格式的优点和缺点列表。不要提供任何其他评论。" +
      generateSelection("文本", "优点和缺点"),
    creativity: "low",
    date: "2024-05-01",
    icon: "bullet-points",
    author: {
      name: "Stephen Kaplan",
      link: "https://github.com/SKaplanOfficial",
    },
  },
  {
    id: "eli-cn",
    title: "用简单的语言解释",
    prompt:
      `用简单的语言解释文本，就像我是一个{argument name=identity default="5岁的孩子"}` +
      generateSelection("文本", "解释"),
    creativity: "low",
    date: "2024-05-01",
    icon: "book",
  },
  {
    id: "text-analysis-cn",
    title: "文本分析",
    prompt:
      "分析文本，并提供关于其语气、风格和潜在受众的见解。" +
      generateSelection("文本", "分析"),
    creativity: "medium",
    date: "2024-05-01",
    icon: "magnifying-glass",
  },
  {
    id: "summarize-product-reviews-cn",
    title: "总结产品评论",
    prompt:
      `仔细阅读以下产品评论。将它们翻译成英文，并创建一个摘要，以点形式列出所有评论的优点和缺点。请记住，每个要点应该是一句话，或者最多两句话。最常提到的要点应该在每个列表中排在前面，每个要点都应有一个百分比，显示评论为该优点或缺点提供了多少证据。例如，如果评论提到产品容易损坏，并提供了一些原因，你对该优点或缺点的信心百分比应该更高，但如果有一些评论对某些事情不确定，或者没有证据，或者没有重复提到，那么百分比应该更低。最后，你应该写一段关于在购买该产品之前我应该注意什么的内容。这些可以是一些警告、提示、建议，或者你认为在购买该产品之前需要了解的任何重要信息。nk is important to know before buying this product.

你可以使用以下模板创建摘要：

'''
## 评论摘要

**✅ 优点：**
- 优点1 - 你对该优点的信心百分比%
- 优点2 - 你对该优点的信心百分比%
...
- 优点n - 你对该优点的信心百分比%

**❌ 缺点：**
- 缺点1 - 你对该缺点的信心百分比%
- 缺点2 - 你对该缺点的信心百分比%
...
- 缺点n - 你对该缺点的信心百分比%

**💡 在购买之前你应该注意：**
- 提示1
- 提示2
...
- 提示n
'''` + generateSelection("产品评论", "摘要"),
    creativity: "low",
    date: "2024-05-01",
    icon: "tag",
    author: {
      name: "Alireza Sheikholmolouki",
      link: "https://github.com/Alireza29675",
    },
  },
];

type IconComponent = (props: SVGProps<SVGSVGElement>) => JSX.Element;

export type Category = {
  name: string;
  slug: string;
  prompts: (Prompt & { iconComponent: IconComponent })[];
  icon: IconName;
  iconComponent: IconComponent;
};

const baseCategories: Category[] = [
  {
    name: "代码",
    slug: "/code",
    prompts: [...code],
    icon: "code" as const,
  },
  {
    name: "浏览器",
    slug: "/browser",
    prompts: [...browser],
    icon: "globe-01" as const,
  },
  {
    name: "沟通",
    slug: "/communication",
    prompts: [...communication],
    icon: "envelope" as const,
  },
  {
    name: "创意",
    slug: "/image",
    prompts: [...image],
    icon: "image" as const,
  },
  {
    name: "写作",
    slug: "/writing",
    prompts: [...writing],
    icon: "pencil" as const,
  },
  {
    name: "音乐",
    slug: "/music",
    prompts: [...music],
    icon: "music" as const,
  },
  {
    name: "想法",
    slug: "/ideas",
    prompts: [...ideas],
    icon: "light-bulb" as const,
  },
  {
    name: "娱乐",
    slug: "/fun",
    prompts: [...fun],
    icon: "game-controller" as const,
  },
  {
    name: "其他",
    slug: "/misc",
    prompts: [...misc],
    icon: "folder" as const,
  }
].map((category) => {
  return {
    ...category,
    iconComponent: Icons[category.icon],
    prompts: category.prompts.map((prompt) => {
      return {
        ...prompt,
        iconComponent: Icons[prompt.icon],
      };
    }),
  };
});

const allPrompts = baseCategories.flatMap((category) => category.prompts);

const newCategory = {
  name: "新增",
  slug: "/new",
  // Show prompts that have been published for the past two weeks
  prompts: allPrompts
    .filter((prompt) => {
      const twoWeeksAgo = new Date();
      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
      return new Date(prompt.date) >= twoWeeksAgo;
    })
    .sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }),
  icon: "calendar" as const,
  iconComponent: Icons["calendar"],
};

export const categories: Category[] = [
  ...(newCategory.prompts.length > 0 ? [newCategory] : []),
  ...baseCategories,
];
