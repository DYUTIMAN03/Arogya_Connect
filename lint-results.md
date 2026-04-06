
C:\Users\ASUS\Desktop\Hackathon PS17\arogya-connect\src\app\analytics\page.tsx
   2:10  warning  'useState' is defined but never used                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         @typescript-eslint/no-unused-vars
  10:7   warning  'weekDays' is assigned a value but never used                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                @typescript-eslint/no-unused-vars
  11:7   warning  'maxWeekly' is assigned a value but never used                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               @typescript-eslint/no-unused-vars
  31:9   error    Error: Cannot reassign variable after render completes

Reassigning `cumulative` after render has completed can cause inconsistent behavior on subsequent renders. Consider using state instead.

C:\Users\ASUS\Desktop\Hackathon PS17\arogya-connect\src\app\analytics\page.tsx:31:9
  29 |         const dash = (s.pct / 100) * circ;
  30 |         const offset = circ - cumulative * circ / 100;
> 31 |         cumulative += s.pct;
     |         ^^^^^^^^^^ Cannot reassign `cumulative` after render completes
  32 |         return (
  33 |           <circle key={i} cx={cx} cy={cy} r={r} fill="none"
  34 |             stroke={s.color} strokeWidth={stroke}  react-hooks/immutability

C:\Users\ASUS\Desktop\Hackathon PS17\arogya-connect\src\app\api\followup\route.ts
  21:19  error  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any

C:\Users\ASUS\Desktop\Hackathon PS17\arogya-connect\src\app\api\register\route.ts
  31:7   warning  'patientRecord' is assigned a value but never used  @typescript-eslint/no-unused-vars
  55:19  error    Unexpected any. Specify a different type            @typescript-eslint/no-explicit-any

C:\Users\ASUS\Desktop\Hackathon PS17\arogya-connect\src\app\api\soap\route.ts
  50:19  error  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any

C:\Users\ASUS\Desktop\Hackathon PS17\arogya-connect\src\app\api\triage\route.ts
   47:46  error  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any
  105:33  error  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any
  167:19  error  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any

C:\Users\ASUS\Desktop\Hackathon PS17\arogya-connect\src\app\coordinator\page.tsx
   20:10  warning  'reviewModal' is assigned a value but never used                 @typescript-eslint/no-unused-vars
   20:23  warning  'setReviewModal' is assigned a value but never used              @typescript-eslint/no-unused-vars
   20:50  error    Unexpected any. Specify a different type                         @typescript-eslint/no-explicit-any
   83:30  warning  'i' is defined but never used                                    @typescript-eslint/no-unused-vars
  145:80  error    `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`  react/no-unescaped-entities
  171:82  error    `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`  react/no-unescaped-entities
  171:84  error    `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`  react/no-unescaped-entities

C:\Users\ASUS\Desktop\Hackathon PS17\arogya-connect\src\app\doctor\page.tsx
  17:10  warning  'consultModal' is assigned a value but never used  @typescript-eslint/no-unused-vars
  18:10  warning  'callSecs' is assigned a value but never used      @typescript-eslint/no-unused-vars
  19:10  warning  'calling' is assigned a value but never used       @typescript-eslint/no-unused-vars
  23:9   warning  'toast' is assigned a value but never used         @typescript-eslint/no-unused-vars
  29:9   warning  'startCall' is assigned a value but never used     @typescript-eslint/no-unused-vars
  38:9   warning  'fmt' is assigned a value but never used           @typescript-eslint/no-unused-vars

C:\Users\ASUS\Desktop\Hackathon PS17\arogya-connect\src\app\followup\page.tsx
   74:21   error  `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`  react/no-unescaped-entities
   78:43   error  `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`  react/no-unescaped-entities
   84:27   error  `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`  react/no-unescaped-entities
   84:29   error  `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`  react/no-unescaped-entities
   90:100  error  `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`  react/no-unescaped-entities
  111:93   error  `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`  react/no-unescaped-entities
  111:103  error  `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`  react/no-unescaped-entities

C:\Users\ASUS\Desktop\Hackathon PS17\arogya-connect\src\app\layout.tsx
  15:9  warning  Custom fonts not added in `pages/_document.js` will only load for a single page. This is discouraged. See: https://nextjs.org/docs/messages/no-page-custom-font  @next/next/no-page-custom-font

C:\Users\ASUS\Desktop\Hackathon PS17\arogya-connect\src\app\page.tsx
  30:121  error  `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`  react/no-unescaped-entities

C:\Users\ASUS\Desktop\Hackathon PS17\arogya-connect\src\app\queue\page.tsx
   4:10  warning  'supabase' is defined but never used            @typescript-eslint/no-unused-vars
   6:7   warning  'CLINIC_ID' is assigned a value but never used  @typescript-eslint/no-unused-vars
  44:38  error    Unexpected any. Specify a different type        @typescript-eslint/no-explicit-any
  49:46  error    Unexpected any. Specify a different type        @typescript-eslint/no-explicit-any
  50:52  error    Unexpected any. Specify a different type        @typescript-eslint/no-explicit-any
  66:19  error    Unexpected any. Specify a different type        @typescript-eslint/no-explicit-any
  73:32  error    Unexpected any. Specify a different type        @typescript-eslint/no-explicit-any

C:\Users\ASUS\Desktop\Hackathon PS17\arogya-connect\src\app\register\page.tsx
  132:21  error  `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`  react/no-unescaped-entities

C:\Users\ASUS\Desktop\Hackathon PS17\arogya-connect\src\app\rxpad\page.tsx
  85:51  error  `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`  react/no-unescaped-entities

C:\Users\ASUS\Desktop\Hackathon PS17\arogya-connect\src\app\triage\page.tsx
  86:67  error  `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`  react/no-unescaped-entities

C:\Users\ASUS\Desktop\Hackathon PS17\arogya-connect\src\components\LiveQueue.tsx
   7:10  warning  'Users' is defined but never used                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  @typescript-eslint/no-unused-vars
  37:31  error    Unexpected any. Specify a different type                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           @typescript-eslint/no-explicit-any
  50:5   error    Error: Calling setState synchronously within an effect can trigger cascading renders

Effects are intended to synchronize state between React and external systems such as manually updating the DOM, state management libraries, or other platform APIs. In general, the body of an effect should do one or both of the following:
* Update external systems with the latest state from React.
* Subscribe for updates from some external system, calling setState in a callback function when external state changes.

Calling setState synchronously within an effect body causes cascading renders that can hurt performance, and is not recommended. (https://react.dev/learn/you-might-not-need-an-effect).

C:\Users\ASUS\Desktop\Hackathon PS17\arogya-connect\src\components\LiveQueue.tsx:50:5
  48 |
  49 |   useEffect(() => {
> 50 |     fetchQueue();
     |     ^^^^^^^^^^ Avoid calling setState() directly within an effect
  51 |
  52 |     const channel = supabase.channel('global_queue')
  53 |       .on(  react-hooks/set-state-in-effect
  65:6   warning  React Hook useEffect has a missing dependency: 'fetchQueue'. Either include it or remove the dependency array                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      react-hooks/exhaustive-deps

C:\Users\ASUS\Desktop\Hackathon PS17\arogya-connect\src\components\Navbar.tsx
  21:22  warning  'setQueueCount' is assigned a value but never used  @typescript-eslint/no-unused-vars

C:\Users\ASUS\Desktop\Hackathon PS17\arogya-connect\src\components\ui\Input.tsx
  11:27  error  React Hook "React.useId" is called conditionally. React Hooks must be called in the exact same order in every component render  react-hooks/rules-of-hooks

Γ£û 49 problems (30 errors, 19 warnings)

