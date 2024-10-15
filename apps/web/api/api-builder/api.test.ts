import { noop } from 'lodash';

import { buildApi, makeApiProcessor } from './api-builder';

const schema = {
  version: true,
  user: {
    current: true
  },
  media: {
    $: true
  },
  post: {
    $: true,
    best: true
  },
  comment: {
    $: {
      delete: true
    },
    'of-the-day': true
  },
  group: {
    $: {
      person: {
        $: {
          message: true
        }
      }
    }
  }
} as const;

const testApi = buildApi(schema);

describe('build api', () => {
  test('builds api', () => {
    // expect(String(testApi)).toBe('/');
    expect(String(testApi.version)).toBe('/version');
    expect(String(testApi.user)).toBe('/user');
    expect(String(testApi.user.current)).toBe('/user/current');
    expect(String(testApi.media)).toBe('/media');
    expect(String(testApi.media.$(0))).toBe('/media/0');
    expect(String(testApi.media.$(12))).toBe('/media/12');
    expect(String(testApi.media.$('12'))).toBe('/media/12');
    expect(String(testApi.post)).toBe('/post');
    expect(String(testApi.post.$('32'))).toBe('/post/32');
    expect(String(testApi.post.best)).toBe('/post/best');
    expect(String(testApi.comment)).toBe('/comment');
    expect(String(testApi.comment.$('32'))).toBe('/comment/32');
    expect(String(testApi.comment.$('32').delete)).toBe('/comment/32/delete');
    expect(String(testApi.comment['of-the-day'])).toBe('/comment/of-the-day');
    expect(String(testApi.group)).toBe('/group');
    expect(String(testApi.group.$('32')).toString()).toBe('/group/32');
    expect(String(testApi.group.$('32').person).toString()).toBe(
      '/group/32/person'
    );
    expect(String(testApi.group.$('32').person.$('12')).toString()).toBe(
      '/group/32/person/12'
    );
    expect(String(testApi.group.$('32').person.$('12').message)).toBe(
      '/group/32/person/12/message'
    );

    expect(() => {
      // @ts-expect-error testing
      String(testApi.media.$());
    }).toThrow();
    expect(() => {
      // @ts-expect-error testing
      String(testApi.media.$(undefined));
    }).toThrow();
    expect(() => {
      // @ts-expect-error testing
      String(testApi.media.$(null));
    }).toThrow();
    expect(() => {
      String(testApi.media.$(''));
    }).toThrow();
    expect(() => {
      // @ts-expect-error testing
      String(testApi.media.$({}));
    }).toThrow();
    expect(() => {
      // @ts-expect-error testing
      String(testApi.media.$(true));
    }).toThrow();
    expect(() => {
      // @ts-expect-error testing
      String(testApi.media.$(false));
    }).toThrow();
  });

  test('api processor', () => {
    const magicProcessor = makeApiProcessor(testApi, (path) => ({
      magic: path
    }));

    expect(magicProcessor((api) => api).magic).toBe('');
    expect(magicProcessor((api) => api.version).magic).toBe('/version');
    expect(magicProcessor((api) => api.user).magic).toBe('/user');
    expect(magicProcessor((api) => api.user.current).magic).toBe(
      '/user/current'
    );
    expect(magicProcessor((api) => api.media).magic).toBe('/media');
    expect(magicProcessor((api) => api.media.$(0)).magic).toBe('/media/0');
    expect(magicProcessor((api) => api.media.$(12)).magic).toBe('/media/12');
    expect(magicProcessor((api) => api.media.$('12')).magic).toBe('/media/12');
    expect(magicProcessor((api) => api.post).magic).toBe('/post');
    expect(magicProcessor((api) => api.post.$('32')).magic).toBe('/post/32');
    expect(magicProcessor((api) => api.post.best).magic).toBe('/post/best');
    expect(magicProcessor((api) => api.comment).magic).toBe('/comment');
    expect(magicProcessor((api) => api.comment.$('32')).magic).toBe(
      '/comment/32'
    );
    expect(magicProcessor((api) => api.comment.$('32').delete).magic).toBe(
      '/comment/32/delete'
    );
    expect(magicProcessor((api) => api.comment['of-the-day']).magic).toBe(
      '/comment/of-the-day'
    );
    expect(magicProcessor((api) => api.group).magic).toBe('/group');
    expect(magicProcessor((api) => api.group.$('32')).magic).toBe('/group/32');
    expect(magicProcessor((api) => api.group.$('32').person).magic).toBe(
      '/group/32/person'
    );
    expect(
      magicProcessor((api) => api.group.$('32').person.$('12')).magic
    ).toBe('/group/32/person/12');
    expect(
      magicProcessor((api) => api.group.$('32').person.$('12').message).magic
    ).toBe('/group/32/person/12/message');

    expect(() => {
      // @ts-expect-error testing
      noop(magicProcessor((api) => api.media.$()).magic);
    }).toThrow();
    expect(() => {
      // @ts-expect-error testing
      noop(magicProcessor((api) => api.media.$(undefined)).magic);
    }).toThrow();
    expect(() => {
      // @ts-expect-error testing
      noop(magicProcessor((api) => api.media.$(null)).magic);
    }).toThrow();
    expect(() => {
      noop(magicProcessor((api) => api.media.$('')).magic);
    }).toThrow();
    expect(() => {
      // @ts-expect-error testing
      noop(magicProcessor((api) => api.media.$({})).magic);
    }).toThrow();
    expect(() => {
      // @ts-expect-error testing
      noop(magicProcessor((api) => api.media.$(true)).magic);
    }).toThrow();
    expect(() => {
      // @ts-expect-error testing
      noop(magicProcessor((api) => api.media.$(false)).magic);
    }).toThrow();
  });
});
